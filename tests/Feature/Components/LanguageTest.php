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
}
