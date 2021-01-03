<?php

namespace Tests\Traits;

use Illuminate\Support\{
    Str,
    Arr,
};

use App\Models\{
    Group,
    User as UserModel,
    Ability,
};

trait User {
    function get_user_with_groups_and_abilities($groups, $abilities) {
        $factory = UserModel::factory();

        $groups = Arr::wrap($groups);
        $abilities = Arr::wrap($abilities);

        foreach ($groups as $group) {
            $factory = $factory->has(Group::factory(["name" => $group, "slug" => Str::slug($group)]));
        }

        foreach ($abilities as $ability) {
            $factory = $factory->has(Ability::factory(["name" => $ability]));
        }

        return $factory->create();
    }

    function get_root_user_with_abilities($abilities = []) {
        $factory = UserModel::factory()
            ->has(Group::factory(["name" => "root", "slug" => "root"]));

        $abilities = is_array($abilities) ? $abilities : func_get_args();

        foreach ($abilities as $ability) {
            if (!Str::startsWith($ability, "root")) {
                $ability = "root/{$ability}";
            }

            $factory = $factory->has(Ability::factory(["name" => $ability]), "abilities");
        }

        return $factory->create();
    }

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
