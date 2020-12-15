<?php

namespace Kwerio\UserService\Upsert;

use Illuminate\Validation\Rule;
use Illuminate\Http\Request;

class Token extends AUser {
    const TYPE = "Token";

    /**
     * {@inheritdoc}
     */
    function set_rules() {
        return $this->rules + [];
    }

    /**
     * {@inheritdoc}
     */
    function create(Request $request) {
        $data = $request->validate($this->rules);

        return $this->upsert($data);
    }

    /**
     * {@inheritdoc}
     */
    function update(Request $request) {
        $data = $request->validate([
            "uuid" => "required|exists:users,uuid",
            "email" => [
                "required",
                "email",
                Rule::unique("users")->ignore($request->get("uuid"), "uuid"),
            ],
        ] + $this->rules);

        return $this->upsert($data);
    }
}
