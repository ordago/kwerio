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

class CreateApiUserTest extends TestCase {
    use WithFaker, RefreshDatabase;

    private $endpoint = "/account/permissions/api-users/create";
    private $api = "/api/account/permissions/api-users/create";

    /** @test */
    function make_token_hashed_after_being_unhashed() {
        // Creates..
        $user = $this->get_root_user_with_abilities("root/api_user_create", "root/api_user_update");
        $this->actingAs($user);

        $data = $this->post($this->api, [
            "uuid" => null,
            "name" => $this->faker->sentence,
            "is_hashed" => false,
            "expires_at" => "1 day",
            "token_unhashed" => null,
            "groups" => [],
            "abilities" => [],
        ])
            ->assertStatus(200)
            ->json()["items"][0];

        $uuid = $data["uuid"];
        $token = $data["token"];

        // Updates..
        $data = $this->post(str_replace("create", "update", $this->api), [
            "uuid" => $data["uuid"],
            "name" => $this->faker->sentence,
            "is_hashed" => true,
            "expires_at" => "2 days",
            "token_unhashed" => null,
            "groups" => [],
            "abilities" => [],
        ])
            ->assertStatus(200)
            ->json()["items"][0];

        $this->assertEquals($data["token_unhashed"], "{$uuid}::{$token}");
    }

    /** @test */
    function create_unhashed_token() {
        // Creates..
        $user = $this->get_root_user_with_abilities("root/api_user_create", "root/api_user_update");
        $this->actingAs($user);

        $data = $this->post($this->api, [
            "uuid" => null,
            "name" => $this->faker->sentence,
            "is_hashed" => false,
            "expires_at" => "1 day",
            "token_unhashed" => null,
            "groups" => [],
            "abilities" => [],
        ])
            ->assertStatus(200)
            ->json()["items"][0];

        $this->assertFalse(ctype_lower(preg_replace("/[0-9]/", "", $data["token"])));
        $this->assertNull($data["token_unhashed"]);

        $token = $data["token"];

        // Updates..
        $data = $this->post(str_replace("create", "update", $this->api), [
            "uuid" => $data["uuid"],
            "name" => $this->faker->sentence,
            "is_hashed" => false,
            "expires_at" => "2 days",
            "token_unhashed" => null,
            "groups" => [],
            "abilities" => [],
        ])
            ->assertStatus(200)
            ->json()["items"][0];

        $this->assertEquals($token, $data["token"]);
    }

    /** @test */
    function create_hashed_token() {
        // Api User is created correctly:
        $user = $this->get_root_user_with_abilities("root/api_user_create", "root/api_user_update");
        $this->actingAs($user);

        $groups = Group::factory(2)
            ->has(Ability::factory(2))
            ->create();

        $abilities = [];
        $groups_uuids = [];

        foreach ($groups as $group) {
            $groups_uuids[] = (string) $group->uuid;

            foreach ($group->abilities as $ability) {
                $abilities[] = $ability->uuid;
            }
        }

        $data = $this->post($this->api, [
            "uuid" => null,
            "name" => $this->faker->sentence,
            "is_hashed" => true,
            "expires_at" => "1 day",
            "token_unhashed" => null,
            "groups" => $groups_uuids,
            "abilities" => $abilities,
        ])
            ->assertStatus(200)
            ->json()["items"][0];

        $this->assertEquals(count($data["groups"]), count($groups_uuids));
        $this->assertEquals(count($data["abilities"]), count($abilities));
        $this->assertTrue(ctype_lower(preg_replace("/[0-9]/", "", $data["token"])));

        $token_unhashed = $data["token_unhashed"];
        $token = $data["token"];

        // If an update is made, the unhashed token should be carried on, as long
        // as unhashed_token is on the request
        $data = $this->post(str_replace("create", "update", $this->api), [
            "uuid" => $data["uuid"],
            "name" => $this->faker->sentence,
            "is_hashed" => true,
            "expires_at" => "2 days",
            "token_unhashed" => $token_unhashed,
            "groups" => $data["groups"],
            "abilities" => $data["abilities"],
        ])
            ->assertStatus(200)
            ->json()["items"][0];

        $this->assertEquals($token, $data["token"]);
        $this->assertEquals($token_unhashed, $data["token_unhashed"]);

        // Unhashed token should be null on response when request is null
        $data = $this->post(str_replace("create", "update", $this->api), [
            "uuid" => $data["uuid"],
            "name" => $this->faker->sentence,
            "is_hashed" => true,
            "expires_at" => "2 days",
            "token_unhashed" => null,
            "groups" => $data["groups"],
            "abilities" => $data["abilities"],
        ])
            ->assertStatus(200)
            ->json()["items"][0];

        $this->assertEquals($token, $data["token"]);
        $this->assertNull($data["token_unhashed"]);
    }
}
