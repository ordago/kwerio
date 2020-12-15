<?php

namespace App\Http\Controllers\Account\Permissions;

use Kwerio\UserService\Normalize;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Kwerio\UserService\Upsert\AUser as UserUpsert;

use Illuminate\Support\Facades\{
    DB,
    Hash,
};

use App\Models\{
    User as UserModel,
    Group as GroupModel,
};

class UserController extends Controller {
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
            "languages" => all_languages(),
            "timezones" => timezone_identifiers_list(),
            "localeIsoFormats" => get_locale_iso_formats(),
        ];
    }

    /**
     * Fetch a user by uuid.
     *
     * @return array
     */
    function fetch_by_uuid(Request $request) {
        $data = $request->validate([
            "uuid" => "required|exists:users,uuid",
        ]);

        $users = UserModel::whereUuid($data["uuid"])->get();

        return $this->_normalize($users);
    }

    /**
     * Create new user.
     *
     * @param Request   $request
     * @return array
     */
    function create(Request $request, UserUpsert $userUpsert) {
        return $userUpsert->create($request);
    }

    /**
     * Update the information related to the given user.
     *
     * @param Request $request
     * @return array
     */
    function update(Request $request, UserUpsert $userUpsert) {
        return $userUpsert->update($request);
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
                "password" => empty($data["password"]) ? null : Hash::make($data["password"]),
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
}
