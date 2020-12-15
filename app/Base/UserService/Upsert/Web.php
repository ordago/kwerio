<?php

namespace Kwerio\UserService\Upsert;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class Web extends AUser {
    const TYPE = "Web";

    /**
     * {@inheritdoc}
     */
    function set_rules() {
        $this->rules += [
            "first_name" => "nullable",
            "last_name" => "nullable",
            "password" => "required|confirmed|min:6",
        ];
    }

    /**
     * {@inheritdoc}
     */
    function create(Request $request) {
        $data = $request->validate($this->rules);

        return $this->upsert($this->_prepare($data));
    }

    /**
     * {@inheritdoc}
     */
    function update(Request $request) {
        $data = $request->validate([
            "password" => "nullable|confirmed|min:6",
            "uuid" => "required|exists:users,uuid",
            "email" => [
                "required",
                "email",
                Rule::unique("users")->ignore($request->get("uuid"), "uuid"),
            ],
        ] + $this->rules);

        return $this->upsert($this->_prepare($data));
    }

    /**
     * Prepare data before upseting it.
     *
     * @param array $data
     * @return array
     */
    function _prepare($data) {
        if (!empty($data["password"])) {
            $data["password"] = Hash::make($data["password"]);
        }

        return $data;
    }
}
