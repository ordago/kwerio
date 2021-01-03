<?php

namespace Tests\Feature;

use Illuminate\Support\Str;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\{
    Module,
    Group,
    User,
    Ability,
};

class ListingGroupsTest extends TestCase {
    use WithFaker, RefreshDatabase;

    private $endpoint = "/account/permissions/groups";
    private $api = "/api/account/permissions/groups";

    private $post_data = [
        "page" => 1,
        "sorts" => [
            ["name" => "name", "dir" => "desc"],
        ],
        "q" => "",
    ];

    /** @test */
    function list_api__deny_non_root_with_listing_ability() {
        $user = $this->get_user_with_groups_and_abilities($this->faker->words(2, true), "root/group_list");
        $this->actingAs($user)->post($this->api, $this->post_data)->assertStatus(403);
    }

    /** @test */
    function list_api__deny_root_without_listing_ability() {
        $user = $this->get_root_user_with_abilities("root/group_create");
        $this->actingAs($user)->post($this->api, $this->post_data)->assertStatus(403);
    }

    /** @test */
    function list_api__allow_root_with_listing_ability() {
        $user = $this->get_root_user_with_abilities("root/group_list");
        $this->actingAs($user)->post($this->api, $this->post_data)->assertStatus(200);
    }

    /** @test */
    function access_page__deny_guest_users() {
        $this->get($this->endpoint)->assertStatus(302);
    }

    /** @test */
    function access_page__deny_root_without_listing_ability() {
        $user = $this->get_root_user_with_abilities();
        $this->actingAs($user)->get($this->endpoint)->assertStatus(403);
    }

    /** @test */
    function access_page__deny_non_root_with_listing_ability() {
        $user = $this->get_user_with_groups_and_abilities($this->faker->words(2, true), "root/group_list");
        $this->actingAs($user)->get($this->endpoint)->assertStatus(403);
    }

    /** @test */
    function access_page__allow_root_with_listing_ability() {
        $user = $this->get_root_user_with_abilities("group_list");
        $this->actingAs($user)->get($this->endpoint)->assertStatus(200);
    }
}
