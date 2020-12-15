<?php

namespace Kwerio\UserService\Upsert;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Models\User as UserModel;
use App\Models\Group as GroupModel;
use Kwerio\UserService\Normalize;

use Kwerio\{
    Languages,
    Locale,
};

use Illuminate\Support\Facades\{
    DB,
    Hash,
};

abstract class AUser {
    use Normalize;

    protected $rules = [];

    abstract function set_rules();
    abstract function create(Request $request);
    abstract function update(Request $request);

    function __construct() {
        $this->rules = [
            "uuid" => "nullable",
            "payload" => "nullable",
            "email" => "required|unique:users,email|email",
            "locale" => [ "nullable", Rule::in(collect(all_languages())->pluck("locale")) ],
            "timezone" => [ "nullable", Rule::in(timezone_identifiers_list()) ],
            "locale_iso_format" => [ "nullable", Rule::in(collect(get_locale_iso_formats())->pluck("label")) ],
            "groups" => "nullable",
        ];

        $this->set_rules($this->rules);
    }

    function get_rules() {
        return $this->rules;
    }

    /**
     * Update or create a user.
     *
     * @Param array $data
     * @return array
     */
    protected function upsert(array $data) {
        DB::beginTransaction();

        try {
            $user = UserModel::updateOrCreate(
                ["uuid" => $data["uuid"]],
                array_filter([
                    "uuid" => @$data["uuid"],
                    "email" => @$data["email"],
                    "type" => static::TYPE,
                    "payload" => @$data["payload"],
                    "password" => @$data["password"],
                    "first_name" => @$data["first_name"],
                    "last_name" => @$data["last_name"],
                    "locale" => @$data["locale"],
                    "is_rtl" => empty(@$data["locale"]) ? null : is_rtl($data["locale"]),
                    "timezone" => @$data["timezone"],
                    "locale_iso_format" => @$data["locale_iso_format"],
                ], function($value) { return !is_null($value); })
            );

            $groups = GroupModel::whereIn("uuid", $data["groups"])->get(["id"]);
            $user->groups()->sync($groups);

            DB::commit();

            return $this->normalize(UserModel::whereUuid($user->uuid)->get());
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }

        abort(403);
    }
}
