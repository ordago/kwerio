<?php declare(strict_types=1);

namespace Modules\BasicAuthentication\Tests\Feature;

use Tests\TestCase;
use Modules\BasicAuthentication\Module;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;

class LoginTest extends TestCase {
    use RefreshDatabase;

    private $module;

    protected function setUp(): void {
        parent::setUp();

        $this->module = resolve(Module::class);
    }

    /** @test */
    function can_login() {
        $user = User::factory()->create();

        $this->post($this->module->route_prefix("login"), [
            "email" => $user->email,
            "password" => "password",
        ])
           ->assertStatus(200);
    }

    /** @test */
    function can_see_login_page() {
        $this->get($this->module->route_prefix("login"))->assertStatus(200);
    }
}
