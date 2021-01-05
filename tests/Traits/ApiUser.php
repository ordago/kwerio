<?php

namespace Tests\Traits;

use Illuminate\Support\Arr;
use Illuminate\Support\Str;

use App\Models\{
    User,
    Group,
    Ability,
    ApiUser as ApiUserModel,
};

trait ApiUser {
    function get_api_user_with_groups_and_ablities($groups, $abilities, $is_hashed = true) {
        $token = Str::random(48);

        $groups = Arr::wrap($groups);
        $abilities = Arr::wrap($abilities);

        $factory = ApiUserModel::factory(["token" => $token])
            ->for(User::factory());

        foreach ($groups as $group) {
            $factory = $factory->has(Group::factory(["name" => $group, "slug" => Str::slug($group)]));
        }

        foreach ($abilities as $ability) {
            $factory = $factory->has(Ability::factory(["name" => $ability]));
        }

        $apiUser = $factory->create();

        if ($is_hashed) {
            $factory = $factory->hashed();
        }

        return $apiUser;
    }

    function get_root_api_user_with_abilities($abilities, $is_hashed = true) {
        $abilities = is_array($abilities) ? $abilities : func_get_args();
        $rootGroup = Group::whereSlug("root")->first();
        $token = Str::random(48);

        if (!$rootGroup) {
            $rootGroup = Group::factory(["name" => "root", "slug" => "root"])->create();
        }

        $factory = ApiUserModel::factory(["token" => $token])
            ->for(User::factory());

        if ($is_hashed) {
            $factory = $factory->hashed();
        }

        foreach ($abilities as $ability) {
            $factory = $factory->has(Ability::factory(["name" => $ability]));
        }

        $apiUser = $factory->create();
        $apiUser->groups()->attach($rootGroup);

        if ($is_hashed) {
            $apiUser->token = "{$apiUser->uuid}::" . $token;
        }

        return $apiUser;
    }
}
