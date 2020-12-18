<?php

namespace Tests\Traits;

use App\Models\User as UserModel;

trait User {
    function login_as_owner() {
        $user = $this->get_user_owner();
        $this->actingAs($user);
        return $user;
    }

    function get_user_owner() {
        return UserModel::factory()
            ->create(["owner_at" => now()])
            ->fresh();
    }
}
