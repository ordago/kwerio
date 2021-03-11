<?php

namespace Tests\Feature\Components;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\Traits\User;
use App\Models\Components\Language;

class LanguageTest extends TestCase {
    use WithFaker,
        RefreshDatabase,
        User;

    private $api = "/api/components/languages";

    /** @test */
    function index() {
        $user = $this->get_user_with_groups_and_abilities("Test", ["Test/language_index"]);
        $this->actingAs($user);

        Language::factory(2)->create(["module" => "Test"]);
        Language::factory(3)->create();

        $languages = $this->post($this->api, [
            "page" => 1,
            "module" => "Test",
        ])
            ->assertStatus(200)
            ->json();

        $this->assertCount(2, $languages["items"]);
    }

    /** @test */
    function create_first_language() {
        $user = $this->get_user_with_groups_and_abilities("Test", ["Test/language_create"]);
        $this->actingAs($user);

        $languages = $this->post("{$this->api}/create", [
            "uuid" => null,
            "locale" => "ar_MA",
            "module" => "Test",
        ])
            ->assertStatus(200)
            ->json();

        $this->assertCount(1, $languages["items"]);
        $language = $languages["items"][0];

        $this->assertEquals($language["locale"], "ar_MA");
        $this->assertNotNull($language["default_at"]);
    }

    /** @test */
    function create_language_for_another_module() {
        $user = $this->get_user_with_groups_and_abilities("Test", ["Test/language_create"]);
        $this->actingAs($user);

        Language::factory(1)->create(["default_at" => now(), "module" => "CRM"]);
        Language::factory(2)->create(["module" => "CRM"]);
        Language::factory(1)->create(["default_at" => now(), "module" => null]);

        $languages = $this->post("{$this->api}/create", [
            "uuid" => null,
            "locale" => "ar_MA",
            "module" => "Test",
        ])
            ->assertStatus(200)
            ->json();

        $this->assertCount(1, $languages["items"]);
        $language = $languages["items"][0];

        $this->assertEquals($language["locale"], "ar_MA");
        $this->assertNotNull($language["default_at"]);
    }

    /** @test */
    function create_language_for_module_with_default() {
        $user = $this->get_user_with_groups_and_abilities("Test", ["Test/language_create"]);
        $this->actingAs($user);

        Language::factory(1)->create(["module" => "Test", "default_at" => now()]);
        Language::factory(5)->create(["module" => "Test"]);

        $languages = $this->post("{$this->api}/create", [
            "uuid" => null,
            "locale" => "ar_MA",
            "module" => "Test",
        ])
            ->assertStatus(200)
            ->json();

        $this->assertCount(1, $languages["items"]);
        $language = $languages["items"][0];

        $this->assertEquals($language["locale"], "ar_MA");
        $this->assertNull($language["default_at"]);
    }

    /** @test */
    function delete_non_default_language() {
        $user = $this->get_user_with_groups_and_abilities("Test", "Test/language_delete");
        $this->actingAs($user);

        Language::factory(1)->create(["default_at" => now(), "module" => "Test"]);
        Language::factory(5)->create(["module" => "Test"]);
        Language::factory(10)->create();

        $uuids = Language::whereNull("default_at")->take(2)->pluck("uuid")->toArray();

        $data = $this->delete($this->api, [
            "uuids" => $uuids,
            "module" => "Test",
        ])
            ->assertStatus(200)
            ->json();

        $results = [];

        foreach ($data["items"] as $item) {
            $results[] = $item["uuid"];
        }

        $this->assertEmpty(array_diff($uuids, $results));
        $this->assertEquals(4, Language::where("module", "Test")->count());
        $this->assertEquals(1, Language::whereNotNull("default_at")->where("module", "Test")->count());
    }

    /** @test */
    function deletes_include_default_language() {
        $user = $this->get_user_with_groups_and_abilities("Test", "Test/language_delete");
        $this->actingAs($user);

        Language::factory(1)->create(["default_at" => now(), "module" => "Test"]);
        Language::factory(10)->create(["module" => "Test"]);
        Language::factory(10)->create();

        $uuids = Language::where("module", "Test")->whereNull("default_at")->take(2)->pluck("uuid");
        $uuid = Language::where("module", "Test")->whereNotNull("default_at")->first()->uuid;

        $uuids = $uuids->add($uuid)->toArray();

        $data = $this->delete($this->api, [
            "uuids" => $uuids,
            "module" => "Test",
        ])
            ->assertStatus(200)
            ->json();

        $results = [];

        foreach ($data["items"] as $language) {
            $results[] = $language["uuid"];
        }

        $this->assertEmpty(array_diff($uuids, $results));
        $this->assertEquals(8, Language::where("module", "Test")->count());
        $this->assertEquals(1, Language::whereNotNull("default_at")->where("module", "Test")->count());
    }
}
