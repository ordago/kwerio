<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;

class UpsertUserTest extends TestCase {
    use WithFaker, RefreshDatabase;

    private $api = "/api/account/permissions/users";
    private $only = [
        "uuid",
        "email",
        "first_name",
        "last_name",
        "locale",
        "timezone",
        "locale_iso_format",
        "can_create_tokens",
    ];

    /** @test */
    function create() {
        $this->login_as_owner();
        $user = User::factory()->make([
            "can_create_tokens" => true,
        ]);

        $data = [
            "uuid" => null,
            "password" => "secret",
            "password_confirmation" => "secret",
            "groups" => []
        ]
            + $user->only($this->only);

        $data = $this->post("{$this->api}/create", $data)
            ->assertStatus(200)
            ->json();

        $this->assertEquals($data["items"][0]["can_create_tokens"], true);
    }
}
