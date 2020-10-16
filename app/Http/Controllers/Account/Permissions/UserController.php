<?php

namespace App\Http\Controllers\Account\Permissions;

use App\Base\Languages;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

use Illuminate\Support\Facades\{
    DB,
    Hash,
};

use App\Models\{
    User as UserModel,
    Group as GroupModel,
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

    /**
     * Show users page.
     *
     * @return View
     */
    function show_page() {
        return view("account.permissions.users");
    }

    /**
     * Show create page.
     *
     * @return View
     */
    function show_create_page() {
        return view("account.permissions.users");
    }

    /**
     * Show update page.
     *
     * @return view
     */
    function show_update_page() {
        return view("account.permissions.users");
    }

    /**
     * Show users page.
     *
     * @return array
     */
    function index(Request $request) {
        $data = $request->validate([
            "page" => "required|numeric",
            "sorts" => "required|array",
            "q" => "",
        ]);

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

        return $this->_normalize($items);
    }

    /**
     * Get metadata.
     *
     * @return array
     */
    function metadata(Languages $languages) {
        return [
            "languages" => $languages->all(),
            "timezones" => timezone_identifiers_list(),
            "localeIsoFormats" => $this->_get_locale_iso_formats(),
        ];
    }

    /**
     * Create new user.
     *
     * @param Request   $request
     * @param Languages $languages
     * @return array
     */
    function create(Request $request, Languages $languages) {
        $data = $request->validate([
            "email" => "required|unique:users,email|email",
            "first_name" => "nullable",
            "last_name" => "nullable",
            "locale" => [ "nullable", Rule::in(collect($languages->all())->pluck("locale")) ],
            "timezone" => [ "nullable", Rule::in(timezone_identifiers_list()) ],
            "locale_iso_format" => [ "nullable", Rule::in(collect($this->_get_locale_iso_formats())->pluck("label")) ],
            "password" => "required|confirmed",
            "groups" => "nullable",
        ]);

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
                "first_name" => $data["first_name"],
                "last_name" => $data["last_name"],
                "locale" => $data["locale"],
                "timezone" => $data["timezone"],
                "locale_iso_format" => $data["locale_iso_format"],
                "password" => Hash::make($data["password"]),
                "is_rtl" => empty($data["locale"]) ? null : is_rtl($data["locale"]),
            ], function($value) {
                return !is_null($value);
            }))
                ->fresh();

            $groups = GroupModel::whereIn("uuid", $data["groups"])->get(["id"]);
            $user->groups()->sync($groups);

            DB::commit();

            return $this->_normalize(UserModel::whereUuid($user->uuid)->get());
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }

        abort(403);
    }

    /**
     * Get a list of supported locale iso formats.
     *
     * @return array
     */
    private function _get_locale_iso_formats() {
        $iso_formats = resolve(Carbon::class)->getIsoFormats();
        $locale_iso_formats = [];

        foreach ($iso_formats as $key => $value) {
            $locale_iso_formats[] = [
                "label" => $key,
                "example" => now()->isoFormat($key),
            ];
        }

        return $locale_iso_formats;
    }

    /**
     * Normalize the users.
     *
     * @param Collection $users
     * @return array
     */
    private function _normalize($users) {
        $items = $users->map(function($user) {
            return $user->only($this->columns);
        });

        $total = UserModel::count();
        $page = request()->get("page");

        return [
            "items" => $items,
            "total" => $total,
            "next_page" => $total === config("app.per_page") ? $page + 1 : $page,
        ];
    }
}
