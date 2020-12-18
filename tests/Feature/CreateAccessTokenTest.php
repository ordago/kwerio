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
    function index() {
        $this->login_as_owner();

        AccessToken::factory(20)->create([
            "user_id" => Auth::id(),
        ]);

        $this->post($this->api_endpoint, [
            "page" => 1,
            "q" => "",
            "sorts" => [],
        ])
            ->dump();
    }

    /** @test */
    function create() {
        $this->login_as_owner();

        $this->post("{$this->api_endpoint}/create")
            ->assertStatus(200);
    }

    /** @test */
    function update() {
        $this->login_as_owner();
        $accessToken = AccessToken::factory()->create(["user_id" => Auth::id()]);

        $data = $this->post("{$this->api_endpoint}/update", [
            "uuid" => $accessToken->uuid,
        ])
            ->assertStatus(200)
            ->json();

        $this->assertEquals($accessToken->uuid, $data["items"][0]["uuid"]);
        $this->assertNotEquals($accessToken->token, hash("sha256", $data["items"][0]["token"]));
    }
}
