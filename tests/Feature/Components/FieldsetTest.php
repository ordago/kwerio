<?php

namespace Tests\Feature\Components;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\Traits\User;
use App\Models\Components\{
    Fieldset,
    Language,
};

class FieldsetTest extends TestCase {
    use WithFaker,
        RefreshDatabase,
        User;

    private $api = "/api/components/fieldsets";

    /** @test */
    function index() {
        $user = $this->get_user_with_groups_and_abilities("Test", "Test/fieldset_index");
        $this->actingAs($user);

        $language = Language::factory()->create(["module" => "Test"]);
        $fieldset = Fieldset::factory(3)->create(["module" => "Test", "locale" => $language->locale]);

        $data = $this->post($this->api, [
            "module" => "Test",
            "page" => 1,
        ])
            ->assertStatus(200)
            ->json();

        $this->assertCount(3, $data["items"]);
    }
}
