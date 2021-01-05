<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\{
    Module,
    Group,
    User,
    Ability,
    ApiUser,
};

class CreateGroupTest extends TestCase {
    use WithFaker, RefreshDatabase;

    private $endpoint = "/account/permissions/groups/create";
    private $api = "/api/account/permissions/groups/create";

    private $post_data = [
        "name" => "test",
        "modules" => [],
        "abilities" => [],
    ];

    /** @test */
    function create_api__non_root_with_create_ability() {
        // User
        $user = $this->get_user_with_groups_and_abilities("ab", "root/group_create");
        $this->actingAs($user)->post($this->api, $this->post_data)->assertStatus(403);
        Auth::logout();

        // Api User
        $apiUser = $this->get_api_user_with_groups_and_ablities("abcd", "root/group_update");
        $this->withHeaders(["Authorization" => "Bearer {$apiUser->token}"])
            ->post($this->api, ["name" => "test2"] + $this->post_data)
            ->assertStatus(403);
    }

    /** @test */
    function create_api__root_without_create_ability() {
        // User
        $user = $this->get_root_user_with_abilities("root/group_update");
        $this->actingAs($user)->post($this->api, $this->post_data)->assertStatus(403);
        Auth::logout();

        // Api User
        $apiUser = $this->get_root_api_user_with_abilities("root/group_update");
        $this->withHeaders(["Authorization" => "Bearer {$apiUser->token}"])
            ->post($this->api, ["name" => "test2"] + $this->post_data)
            ->assertStatus(403);
    }

    /** @test */
    function create_api__root_with_create_ability() {
        // User
        $user = $this->get_root_user_with_abilities("root/group_create");
        $this->actingAs($user)->post($this->api, $this->post_data)->assertStatus(200);
        Auth::logout();

        // Api User
        $apiUser = $this->get_root_api_user_with_abilities("root/group_create");
        $this->withHeaders(["Authorization" => "Bearer {$apiUser->token}"])
            ->post($this->api, ["name" => "test2"] + $this->post_data)
            ->assertStatus(200);
    }

    /** @test */
    function access_page__root_with_create_ability() {
        $user = $this->get_root_user_with_abilities("root/group_create");
        $this->actingAs($user)->get($this->endpoint)->assertStatus(200);
    }

    /** @test */
    function access_page__root_without_create_ability() {
        $user = $this->get_root_user_with_abilities("root/group_update");
        $this->actingAs($user)->get($this->endpoint)->assertStatus(403);
    }

    /** @test */
    function access_page__non_root_with_create_ability() {
        $user = $this->get_user_with_groups_and_abilities("abcd", "root/group_update");
        $this->actingAs($user)->get($this->endpoint)->assertStatus(403);
    }
}
