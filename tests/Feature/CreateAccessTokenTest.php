<?php

namespace Tests\Feature;

use Carbon\Carbon;
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
            ->assertStatus(200);
    }

    /** @test */
    function create_with_expired_at() {
        $this->login_as_owner();
        $at = AccessToken::factory()->make([
            "uuid" => null,
            "expired_at" => "3 days",
        ]);

        $data = $this->post("{$this->api_endpoint}/create", $at->only("name", "is_hashed", "uuid", "expired_at"))
            ->assertStatus(200)
            ->json();

        $item = $data["items"][0];
        $now = date("Y-m-d");
        $expired_at = Carbon::create($item["expired_at"])->subDays(3)->format("Y-m-d");

        $this->assertEquals($now, $expired_at);
    }

    /** @test */
    function create() {
        $this->login_as_owner();
        $at = AccessToken::factory()->make([
            "is_hashed" => true,
            "uuid" => null,
        ]);

        $data = $this->post("{$this->api_endpoint}/create", $at->only("name", "is_hashed", "uuid", "expired_at"))
            ->assertStatus(200)
            ->json();

        $item = $data["items"][0];

        $this->assertEquals($at->name, $item["name"]);
        $this->assertEquals($at->is_hashed, $item["is_hashed"]);
    }

    /** @test */
    function update() {
        $this->login_as_owner();
        $at = AccessToken::factory()->create([
            "user_id" => Auth::id(),
            "is_hashed" => true,
        ]);

        $data = $this->post("{$this->api_endpoint}/update", $at->only("name", "is_hashed", "uuid", "expired_at"))
            ->assertStatus(200)
            ->json();

        $item = $data["items"][0];
        $this->assertEquals($at->uuid, $item["uuid"]);
        $this->assertNotEquals($at->token, hash("sha256", $item["token"]));
    }
}
