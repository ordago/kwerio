<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Http;
use App\Models\{
    Group,
    User,
};

class RootAccessTest extends TestCase {
    use WithFaker, RefreshDatabase;

    private $endpoint = "/~test";

    /** @test */
    function allow_root_users() {
        $this->login_as_root();

        $data = $this
            ->get("{$this->endpoint}/root-access")
            ->assertStatus(200)
            ->json();

        $this->assertEquals(["type" => "root_access"], $data);
    }

    /** @test */
    function forbid_non_root_users() {
        $user = User::factory()
            ->has(Group::factory())
            ->create();

        $this
            ->actingAs($user)
            ->get("{$this->endpoint}/root-access")
            ->assertStatus(403);
    }
}
