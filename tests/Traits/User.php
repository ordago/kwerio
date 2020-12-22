<?php

namespace Tests\Traits;

use App\Models\{
    Group,
    User as UserModel,
};

trait User {
    function login_as_root() {
        $user = UserModel::factory()
            ->has(Group::factory(["name" => "root", "slug" => "root"]))
            ->create()
            ->fresh();

        $this->actingAs($user);

        return $user;
    }

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
