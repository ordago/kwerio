<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Tests\Utils\Tenant;

/** Issue: 12 */
class ShowWelcomePageOnRootDomainTest extends TestCase {
    /** @test */
    function it_200() {
        $this->get("/")->assertStatus(200);
    }

    /** @test */
    function it_redirect_to_tenant_login_page() {
        $url = resolve(Tenant::class)->random_domain_404();

        $this->get("http://{$url}")->assertRedirect("/_/login");
    }
}
