<?php

namespace Tests\Feature;

use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Auth;
use App\Models\AccessToken;
use Illuminate\Support\Str;

class UpsertAccessTokenTest extends TestCase {
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
    function fetch_by_uuid() {
        $this->login_as_owner();
        $at = AccessToken::factory()->create(["user_id" => Auth::id()]);

        $this->post("{$this->api_endpoint}/fetch-by-uuid", $at->only("uuid"))
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

        $data = ["original_token" => null] + $at->only("name", "is_hashed", "uuid", "expired_at");
        $data = $this->post("{$this->api_endpoint}/update", $data)
            ->assertStatus(200)
            ->json();

        $item = $data["items"][0];
        $this->assertEquals($at->uuid, $item["uuid"]);
        $this->assertEquals(hash("sha256", $at->token), hash("sha256", $item["token"]));
    }

    /** @test */
    function update_unhashed_token() {
        $this->login_as_owner();
        $at = AccessToken::factory()->create([
            "user_id" => Auth::id(),
            "is_hashed" => false,
            "token" => Str::random(48),
        ]);

        $data = ["original_token" => null] + $at->only("name", "is_hashed", "uuid", "expired_at");
        $data = $this->post("{$this->api_endpoint}/update", $data)
            ->assertStatus(200)
            ->json();

        $item = $data["items"][0];
        $this->assertEquals($at->token, $item["token"]);
    }

    /** @test */
    function update_hash_token() {
        $this->login_as_owner();
        $at = AccessToken::factory()->create([
            "user_id" => Auth::id(),
            "is_hashed" => false,
            "token" => Str::random(48),
        ]);

        $data = ["is_hashed" => true, "original_token" => null] + $at->only("name", "is_hashed", "uuid", "expired_at");
        $data = $this->post("{$this->api_endpoint}/update", $data)
            ->assertStatus(200)
            ->json();

        $item = $data["items"][0];
        $this->assertEquals(hash("sha256", $at->token), $item["token"]);
    }

    /** @test */
    function update_with_original_token_included() {
        $this->login_as_owner();
        $at = AccessToken::factory()->create([
            "user_id" => Auth::id(),
            "is_hashed" => false,
            "token" => Str::random(48),
        ]);

        $data = $at->only("name", "is_hashed", "uuid", "expired_at");
        $data = ["original_token" => $at->token] + $data;

        $data = $this->post("{$this->api_endpoint}/update", $data)
            ->assertStatus(200)
            ->json();

        $item = $data["items"][0];
        $this->assertEquals($item["original_token"], $at->token);
    }
}
