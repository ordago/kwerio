<?php

namespace App\Http\Controllers\Account\Permissions;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use App\Models\{
    ApiUser as ApiUserModel,
    User as UserModel,
    Group as GroupModel,
    Ability as AbilityModel,
    Module as ModuleModel,
};

class ApiUserController extends Controller {
    private $token = null;

    private $rules = [
        "name" => "required",
        "is_hashed" => "nullable|boolean",
        "expires_at" => "nullable",
        "token_unhashed" => "nullable",
        "groups" => "nullable|array",
        "abilities" => "nullable|array",
    ];

    /**
     * Show api users page.
     *
     * @return View
     */
    function show_index_page() {
        $abilities = [
            "root/api_user_list",
            "root/api_user_create",
        ];

        if (!Gate::any($abilities)) {
            abort(403);
        }

        return view("account.permissions.api-users");
    }

    /**
     * Show create api users page.
     *
     * @return View
     */
    function show_create_page() {
        return view("account.permissions.api-users");
    }

    /**
     * Show update api users page.
     *
     * @return View
     */
    function show_update_page() {
        return view("account.permissions.api-users");
    }

    /**
     * Get tokens.
     *
     * @return array
     */
    function index(Request $request) {
        $data = $request->validate([
            "page" => "required|numeric",
            "sorts" => "array",
            "q" => "nullable",
        ]);

        $query = ApiUserModel::query();

        if (!empty($data["q"])) {
            $query->where("name", "like", "%{$data['q']}%")
                ->orWhere("token", "like", "%{$data['q']}%");
        }

        foreach ($data["sorts"] as $sort) {
            if (in_array($sort["name"], ["email"])) {
                $query->with(["user" => function($query) use($sort) {
                    $query->orderBy($sort["name"], $sort["dir"]);
                }]);
            } else {
                $query->orderBy($sort["name"], $sort["dir"]);
            }
        }

        $items = $query->paginate(config("app.per_page"));

        return $this->_normalize($items);
    }

    /**
     * Create new api user.
     *
     * @param Request $request
     * @return array
     */
    function create(Request $request) {
        $this->authorize("root/api_user_create");
        $data = $request->validate(["uuid" => "nullable"] + $this->rules);

        return $this->_upsert($data, Str::random(48));
    }

    /**
     * Update existing api user.
     *
     * @param Request $request
     * @return array
     */
    function update(Request $request) {
        $this->authorize("root/api_user_update");

        $data = $request->validate([
            "uuid" => "required|exists:api_users,uuid",
        ] + $this->rules);

        $token = null;

        if ($data["is_hashed"]) {
            $apiUser = ApiUserModel::whereUuid($data["uuid"])->firstOrFail();

            if ($apiUser->is_hashed === false) {
                $token = $apiUser->token;
            }
        }

        return $this->_upsert($data, $token);
    }

    /**
     * Create or update an api user.
     *
     * @param string|null $uuid
     * @return array
     */
    private function _upsert($data, $original_token = null) {
        DB::beginTransaction();

        try {
            $appends = [];
            $this->token = null;

            // Creating token..
            if (is_string($original_token)) {
                $token = $original_token;
                if ($data["is_hashed"]) $token = hash("sha256", $token);
                $appends["token"] = $token;
            }

            // Convert expires at..
            if (!empty($data["expires_at"])) {
                $expires_at = strtotime("+ " . $data["expires_at"]);

                if ($expires_at) {
                    $data["expires_at"] = Carbon::createFromTimestamp($expires_at);
                }
            }

            // Storing token..
            $apiUser = ApiUserModel::updateOrCreate(["uuid" => $data["uuid"]], [
                "user_id" => Auth::id(),
                "is_hashed" => $data["is_hashed"],
                "name" => $data["name"],
                "expires_at" => $data["expires_at"],
            ] + $appends);

            if (is_string($original_token) && $apiUser->is_hashed) {
                $this->token = "{$apiUser->uuid}::{$original_token}";
            }

            if (!is_null($data["token_unhashed"])) {
                $this->token = $data["token_unhashed"];
            }

            // Syncing groups..
            $groups = GroupModel::whereIn("uuid", $data["groups"])->pluck("id");
            $apiUser->groups()->sync($groups);

            // Syncing abilities..
            $abilities = [];

            foreach ($apiUser->groups as $group) {
                foreach ($group->abilities as $ability) {
                    if (in_array($ability->uuid, $data["abilities"])) {
                        $abilities[] = $ability->id;
                    }
                }
            }

            $apiUser->abilities()->sync($abilities);

            DB::commit();

            return $this->_normalize(
                $apiUser->whereUuid($apiUser->uuid)->get()
            );
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }

    function fetch_by_uuid(Request $request) {
        $abilities = ["root/api_user_list", "root/api_user_update"];

        if (!Gate::any($abilities)) {
            abort(403);
        }

        $data = $request->validate([
            "uuid" => "required|exists:api_users,uuid",
        ]);

        return $this->_normalize(
            ApiUserModel::whereUuid($data["uuid"])->get()
        );
    }

    /**
     * Get metadata.
     *
     * @return array
     */
    function metadata() {
        $metadata = [ ];

        $abilities = [
            "root/api_user_create",
            "root/api_user_update",
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
     * Normalize api user data.
     *
     * @param LengthAwarePaginator|Collect $apiUsers
     * @return array
     */
    private function _normalize($apiUsers) {
        $items = $apiUsers->map(function($apiUser) {
            return [
                "uuid" => $apiUser->uuid,
                "name" => $apiUser->name,
                "is_hashed" => (bool) $apiUser->is_hashed,
                "token" => $apiUser->token,
                "email" => $apiUser->user->email,
                "groups" => $apiUser->groups->pluck("uuid")->toArray(),
                "abilities" => $apiUser->abilities->pluck("uuid")->toArray(),
                "token_unhashed" => $this->token,
                "expires_at" => $apiUser->expires_at,
                "created_at" => $apiUser->created_at,
                "updated_at" => $apiUser->udpated_at,
            ];
        });

        if (method_exists($apiUsers, "total")) {
            $total = $apiUsers->total();
        } else {
            $total = ApiUserModel::count();
        }

        $page = request()->get("page") ?? 1;

        return [
            "items" => $items,
            "total" => $total,
            "next_page" => $total === config("app.per_page") ? $page + 1 : $page,
        ];
    }
}
