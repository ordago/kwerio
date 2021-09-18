<?php

namespace App\Http\Controllers\LordLand\Admission;

use Illuminate\Support\Facades\Gate;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Kwerio\Normalizer;

use Illuminate\Support\Facades\{
    DB,
    Hash,
};

use App\Models\{
    User as UserModel,
    Group as GroupModel,
    Ability as AbilityModel,
    Module as ModuleModel,
};

class UserController extends Controller {
    private $columns = [
        "uuid",
        "email",
        "first_name",
        "last_name",
        "locale",
        "timezone",
        "locale_iso_format",
        "created_at",
        "updated_at",
    ];

    private $rules = [];

    /**
     * Initialize constructor.
     */
    function __construct() {
        $this->rules = [
            "email" => "required|unique:users,email|email",
            "first_name" => "nullable",
            "last_name" => "nullable",
            "locale" => [ "nullable", Rule::in(collect(all_languages())->pluck("locale")) ],
            "timezone" => [ "nullable", Rule::in(timezone_identifiers_list()) ],
            "locale_iso_format" => [ "nullable", Rule::in(collect(get_locale_iso_formats())->pluck("label")) ],
            "password" => "required|confirmed|min:6",
            "groups" => "nullable",
            "abilities" => "nullable",
        ];
    }

    /**
     * Show users page.
     *
     * @return View
     */
    function show_index_page() {
        $abilities = [
            "root/user_index",
            "root/user_create",
        ];

        if (!Gate::any($abilities)) {
            abort(403);
        }

        return view("account.permissions.users");
    }

    /**
     * Show create page.
     *
     * @return View
     */
    function show_create_page() {
        $this->authorize("root/user_create");
        return view("account.permissions.users");
    }

    /**
     * Show update page.
     *
     * @return view
     */
    function show_update_page() {
        $this->authorize("root/user_update");
        return view("account.permissions.users");
    }

    /**
     * Show users page.
     *
     * @return array
     */
    function index(Request $request, Normalizer $normalizer) {
        $this->authorize("root/user_index");

        $data = $request->validate([
            "page" => "required|numeric",
            "sorts" => "nullable|array",
            "q" => "nullable",
        ]);

        $data["sorts"] = empty($data["sorts"]) ? [] : $data["sorts"];

        $query = UserModel::query();

        if (!empty($data["q"])) {
            $query->where("email", "like", "%{$data['q']}%")
                ->orWhere("first_name", "like", "%{$data['q']}%")
                ->orWhere("last_name", "like", "%{$data['q']}%");
        }

        foreach ($data["sorts"] as $sort) {
            $query->orderBy($sort["name"], $sort["dir"] ?? "asc");
        }

        $items = $query->paginate(config("app.per_page"));

        return $normalizer->normalize($items, [$this, "_normalize_callback"]);
    }

    /**
     * Get metadata.
     *
     * @return array
     */
    function metadata() {
        $metadata = [
            "languages" => all_languages(),
            "timezones" => timezone_identifiers_list(),
            "localeIsoFormats" => get_locale_iso_formats(),
        ];

        $abilities = [
            "root/user_create",
            "root/user_update",
        ];

        if (Auth::user()->canAny($abilities)) {
            $metadata += [
                "abilities" => AbilityModel::all_normalized(),
                "groups" => GroupModel::all_normalized(),
                "modules" => ModuleModel::all_normalized(),
            ];
        }

        return $metadata;
    }

    /**
     * Fetch a user by uuid.
     *
     * @return array
     */
    function fetch_by_uuid(Request $request, Normalizer $normalizer) {
        $abilities = [
            "root/user_index",
            "root/user_update",
        ];

        if (!Gate::any($abilities)) {
            abort(403);
        }

        $data = $request->validate([
            "uuid" => "required|exists:users,uuid",
        ]);

        $user = UserModel::whereUuid($data["uuid"])->first();

        return $normalizer->normalize($user, [$this, "_normalize_callback"]);
    }

    /**
     * Create new user.
     *
     * @param Request   $request
     * @return array
     */
    function create(Request $request) {
        $this->authorize("root/user_create");
        $data = $request->validate($this->rules);
        return $this->_upsert($data);
    }

    /**
     * Update the information related to the given user.
     *
     * @param Request $request
     * @return array
     */
    function update(Request $request) {
        $this->authorize("root/user_update");

        $data = $request->validate(array_merge($this->rules, [
            "uuid" => "required|exists:users,uuid",
            "password" => "nullable|confirmed|min:6",
            "email" => [
                "required",
                "email",
                Rule::unique("users")->ignore($request->get("uuid"), "uuid"),
            ],
        ]));

        return $this->_upsert($data);
    }

    /**
     * Upsert user.
     *
     * @param array $data
     * @return array
     */
    private function _upsert(array $data) {
        DB::beginTransaction();

        try {
            $user = UserModel::updateOrCreate(["uuid" => @$data["uuid"]], array_filter([
                "email" => $data["email"],
                "first_name" => $data["first_name"] ?? null,
                "last_name" => $data["last_name"] ?? null,
                "locale" => $data["locale"] ?? null,
                "timezone" => $data["timezone"] ?? null,
                "locale_iso_format" => $data["locale_iso_format"] ?? null,
                "password" => empty($data["password"]) ? null : Hash::make($data["password"]),
                "is_rtl" => empty($data["locale"]) ? null : is_rtl($data["locale"]),
            ], function($value) {
                return !is_null($value);
            }))
                ->fresh();

            $groups = GroupModel::whereIn("uuid", $data["groups"] ?? [])->get(["id"]);
            $user->groups()->sync($groups);

            $abilities = [];

            foreach ($groups as $group) {
                foreach ($group->abilities as $ability) {
                    if (in_array($ability->uuid, $data["abilities"])) {
                        $abilities[] = $ability->uuid;
                    }
                }
            }

            $abilities = AbilityModel::whereIn("uuid", $abilities)->get(["id"]);
            $user->abilities()->sync($abilities);

            DB::commit();

            return resolve(Normalizer::class)
                ->message("User {$user->email} upserted successfully")
                ->normalize($user->fresh(), [$this, "_normalize_callback"]);
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Delete users.
     */
    function delete(Request $request, Normalizer $normalizer) {
        $this->authorize("root/user_delete");

        $data = $request->validate([
            "uuids" => "required",
        ]);

        $users = UserModel::whereIn("uuid", $data["uuids"])->get();

        UserModel::whereIn("uuid", $data["uuids"])->delete();

        return $normalizer
            ->message("Users deleted successfully")
            ->normalize($users, [$this, "_normalize_callback"]);
    }

    /**
     * Normalizer callback.
     *
     * @param Collection $users
     * @return array
     */
    function _normalize_callback(UserModel $user) {
        $groups = $user->groups->pluck("uuid")->toArray();
        $abilities = $user->abilities->pluck("uuid")->toArray();

        return array_merge(
            compact("groups", "abilities"),
            $user->only($this->columns)
        );
    }
}
