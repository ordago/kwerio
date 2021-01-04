<?php

namespace App\Http\Controllers\Account\Permissions;

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
    private $carry_token = false;
    private $token = null;

    /**
     * Show api users page.
     *
     * @return View
     */
    function show_index_page() {
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
        $data = $request->validate([
            "uuid" => "nullable",
            "name" => "nullable",
            "is_hashed" => "required|boolean",
            "expires_at" => "nullable",
        ]);

        $this->carry_token = true;

        return $this->_upsert($data);
    }

    /**
     * Update existing api user.
     *
     * @param Request $request
     * @return array
     */
    function update(Request $request) {
        $data = $request->validate([
            "uuid" => "required|exists:api_users,uuid",
            "name" => "nullable",
            "is_hashed" => "required|boolean",
            "expires_at" => "nullable",
            "original_token" => "nullable",
        ]);

        return $this->_upsert($data);
    }

    /**
     * Create or update an api user.
     *
     * @param string|null $uuid
     * @return array
     */
    private function _upsert($data) {
        $token = $this->token = Str::random(48);

        if (!empty($data["original_token"])) {
            $this->carry_token = true;
            $this->token = $data["original_token"];
        }

        if ($data["is_hashed"]) {
            $token = hash("sha256", $token);
        }

        if (!empty($data["uuid"])) {
            $item = ApiUserModel::whereUuid($data["uuid"])->firstOrFail();
            $token = $item->token;

            if ($data["is_hashed"] && !$item->is_hashed) {
                $token = $data["uuid"] . "::" . hash("sha256", $item->token);
            }
        }

        if (!empty($data["expires_at"])) {
            $expires_at = strtotime("+ " . $data["expires_at"]);

            if ($expires_at) {
                $data["expires_at"] = Carbon::createFromTimestamp($expires_at);
            }
        }

        $apiUser = ApiUserModel::updateOrCreate(["uuid" => $data["uuid"]], [
            "user_id" => Auth::id(),
            "is_hashed" => $data["is_hashed"],
            "name" => $data["name"],
            "expires_at" => $data["expires_at"],
            "token" => $token,
        ]);

        if (empty($data["uuid"]) && $data["is_hashed"]) {
            $apiUser->token = $apiUser->uuid . "::" . $apiUser->token;
            $apiUser->save();
        }

        return $this->_normalize(
            $apiUser->whereUuid($apiUser->uuid)->get()
        );
    }

    function fetch_by_uuid(Request $request) {
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
                "original_token" => $this->carry_token ? $this->token : null,
                "email" => $apiUser->user->email,
                "created_at" => $apiUser->created_at,
                "updated_at" => $apiUser->udpated_at,
                "expires_at" => $apiUser->expires_at,
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
