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

class UpdateGroupTest extends TestCase {
    use WithFaker, RefreshDatabase;

    private $endpoint = "/account/permissions/groups/{uuid}";
    private $api = "/api/account/permissions/groups/update";

    private $post_data = [
        "name" => "test",
        "modules" => [],
        "abilities" => [],
    ];

    /** @test */
    function update_api__deny_root_without_udpate_ability() {
        $user = $this->get_root_user_with_abilities("root/group_create");
        $group = Group::factory()->create();
        $this->actingAs($user)->post($this->api, [
            "uuid" => $group->uuid,
            "name" => $group->name,
        ] + $this->post_data)
        ->assertStatus(403);
        Auth::logout();

        $apiUser = $this->get_root_api_user_with_abilities("root/group_create");
        $this->withHeaders(["Authorization" => "Bearer {$apiUser->token}"])
            ->post($this->api, [
                "uuid" => $group->uuid,
                "name" => $group->name,
            ] + $this->post_data)
            ->assertStatus(403);
    }

    /** @test */
    function update_api__allow_root_with_update_ability() {
        $user = $this->get_root_user_with_abilities("root/group_update");
        $group = Group::factory()->create();
        $this->actingAs($user)->post($this->api, [
            "uuid" => $group->uuid,
            "name" => $group->name,
        ] + $this->post_data)->assertStatus(200);
        Auth::logout();

        $apiUser = $this->get_root_api_user_with_abilities("root/group_update");
        $this->withHeaders(["Authorization" => "Bearer {$apiUser->token}"])
            ->post($this->api, [
                "uuid" => $group->uuid,
                "name" => $group->name,
            ] + $this->post_data)
            ->assertStatus(200);
    }

    /** @test */
    function access_page__deny_non_root_with_update_ability() {
        $user = $this->get_user_with_groups_and_abilities("abcd", "root/group_update");
        $this->actingAs($user)->get($this->endpoint)->assertStatus(403);
    }

    /** @test */
    function access_page__deny_root_without_update_ability() {
        $user = $this->get_root_user_with_abilities("root/group_create");
        $this->actingAs($user)->get($this->endpoint)->assertStatus(403);
    }

    /** @test */
    function access_page__allow_root_with_update_ability() {
        $user = $this->get_root_user_with_abilities("root/group_update");
        $this->actingAs($user)->get($this->endpoint)->assertStatus(200);
        Auth::logout();

        $apiUser = $this->get_root_api_user_with_abilities("root/group_update");
        $this->get($this->endpoint)->assertStatus(302);
    }

    /** @test */
    function sync_abilities_when_module_removed() {
        $module1 = Module::factory()->has(Ability::factory(2))->create();
        $module2 = Module::factory()->has(Ability::factory(3))->create();
        $module3 = Module::factory()->has(Ability::factory(4))->create();

        $modules = Module::take(2)->get();
        $abilities = Module::take(2)->get()->map(function($m) { return $m->abilities; })->flatten();

        $group = Group::factory()->create();
        $group->modules()->sync($modules->pluck("id"));
        $group->abilities()->sync($abilities->pluck("id"));

        $this->assertEquals($group->abilities->count(), 5);

        $modules = Module::take(2)->get();
        $abilities = [];
        $taken = true;

        foreach ($modules as $module) {
            foreach ($module->abilities as $ability) {
                if ($taken) {
                    $abilities[] = $ability->uuid;
                }

                $taken = !$taken;
            }
        }

        $user = $this->get_root_user_with_abilities("root/group_update");
        $data = $this->actingAs($user)->post($this->api, [
            "uuid" => $group->uuid,
            "name" => $this->faker->sentence,
            "modules" => $modules->pluck("uuid")->toArray(),
            "abilities" => $abilities,
        ])
            ->assertStatus(200)
            ->json();

        $this->assertEquals(count($data["items"][0]["abilities"]), count($abilities));
    }
}
