<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Str;
use App\Models\AccessToken;
use Illuminate\Support\Facades\Auth;

class AccessTokenTest extends TestCase {
    use WithFaker, RefreshDatabase;

    /** @test */
    function simple() {
        $this->login_as_owner();

        $at = AccessToken::factory()->create([
            "user_id" => Auth::id(),
            "is_hashed" => false,
            "token" => $token = Str::random(48),
        ]);

        Auth::logout();

        $data = $this
            ->withHeaders(["Authorization" => "Bearer {$token}"])
            ->get("/_/about/api")
            ->json();

        dd($data);
    }
}
