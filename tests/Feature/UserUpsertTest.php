<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use Kwerio\UserService\Upsert\Web;
use Illuminate\Support\Facades\Hash;

class UserUpsertTest extends TestCase {
    use WithFaker, RefreshDatabase;

    /** @test */
    function update_web_user() {
        $this->login_as_owner();
        $user = User::factory()->web()->create();
        $userMake = User::factory()
            ->web()
            ->make([
                "uuid" => $user->uuid,
                "password" => "secret_updated",
                "password_confirmation" => "secret_updated",
                "groups" => [],
            ]);

        $response = $this->post("/api/account/permissions/users/update", $userMake->toArray())
            ->assertJson([
                "items" => [
                    [
                        "groups" => [],
                        "type" => Web::TYPE,
                        "email" => $userMake->email,
                        "first_name" => $userMake->first_name,
                        "last_name" => $userMake->last_name,
                        "locale" => $userMake->locale,
                        "timezone" => $userMake->timezone,
                        "locale_iso_format" => $userMake->locale_iso_format,
                    ],
                ],
                "total" => 2,
                "next_page" => null,
            ])
            ->assertStatus(200);

        $dbUser = User::whereUuid($user->uuid)->first();
        $this->assertTrue(Hash::check("secret_updated", $dbUser->password));
    }

    /** @test */
    function create_web_user() {
        $this->login_as_owner();
        $user = User::factory()
            ->web()
            ->make([
                "uuid" => null,
                "password" => "secret",
                "password_confirmation" => "secret",
                "groups" => [],
            ]);

        $response = $this->post("/api/account/permissions/users/create", $user->toArray())
            ->assertJson([
                "items" => [
                    [
                        "groups" => [],
                        "type" => Web::TYPE,
                        "email" => $user->email,
                        "first_name" => $user->first_name,
                        "last_name" => $user->last_name,
                        "locale" => $user->locale,
                        "timezone" => $user->timezone,
                        "locale_iso_format" => $user->locale_iso_format,
                    ],
                ],
                "total" => 2,
                "next_page" => null,
            ])
            ->assertStatus(200);

        $data = $response->json()["items"][0];
        $this->assertDatabaseHas("users", ["uuid" => $data["uuid"]]);

        $dbUser = User::whereUuid($data["uuid"])->first();
        $this->assertTrue(Hash::check("secret", $dbUser->password));
    }
}
