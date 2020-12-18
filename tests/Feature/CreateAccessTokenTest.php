<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Auth;
use App\Models\AccessToken;

class CreateAccessTokenTest extends TestCase {
    use WithFaker, RefreshDatabase;

    protected $api_endpoint = "/api/account/permissions/access-tokens";

    /** @test */
    function create() {
        $this->login_as_owner();

        $this->post("{$this->api_endpoint}/create")
            ->assertJsonStructure(["uuid", "token"])
            ->assertStatus(200);
    }

    /** @test */
    function update() {
        $this->login_as_owner();
        $accessToken = AccessToken::factory()->create(["user_id" => Auth::id()]);

        $data = $this->post("{$this->api_endpoint}/update", [
            "uuid" => $accessToken->uuid,
        ])
            ->assertJsonStructure(["uuid", "token"])
            ->assertStatus(200)
            ->json();

        $this->assertEquals($accessToken->uuid, $data["uuid"]);
        $this->assertNotEquals($accessToken->token, hash("sha256", $data["token"]));
    }
}
