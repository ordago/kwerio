<?php declare(strict_types=1);

namespace Modules\BasicAuthentication\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Modules\BasicAuthentication\Module;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SignupTest extends TestCase {
    use RefreshDatabase;

    private $module;

    protected function setUp(): void {
        parent::setUp();

        $this->module = resolve(Module::class);
    }

    /** @test */
    function validation_failed() {
        $user = User::factory()->make();

        $this->post($this->module->route_prefix("signup"), [
            "email" => $user->email,
            "password" => "password",
            "password_confirmation" => "secret",
        ])
            ->assertSessionHasErrors("password");
    }

    /** @test */
    function can_create_an_account_and_log_the_user_in() {
        $user = User::factory()->make();

        $this->post($this->module->route_prefix("signup"), [
            "email" => $user->email,
            "password" => "password",
            "password_confirmation" => "password",
        ])
            ->assertStatus(201);

        $user = User::whereEmail($user->email)->first();
        $this->assertTrue(Hash::check("password", $user->password));
        $this->assertAuthenticatedAs($user);
    }

    /** @test */
    function can_see_signup_page() {
        $this->get($this->module->route_prefix("signup"))->assertStatus(200);
    }
}
