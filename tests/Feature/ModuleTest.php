<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\{
    Group,
    Module,
    User,
};

class ModuleTest extends TestCase {
    use WithFaker, RefreshDatabase;

    /** @test */
    function can_access_modules() {
        $user = User::factory()
            ->has(Group::factory(2)->has(Module::factory(2)))
            ->create();

        $user2 = User::factory()
            ->has(Group::factory(2)->has(Module::factory(2)))
            ->create();

        $modules = $user->modules()->pluck("uid")->toArray();
        $modules2 = $user2->modules()->pluck("uid")->toArray();

        $this->assertTrue($user->can_access_modules($modules));
        $this->assertTrue($user->can_access_modules($modules[0]));

        $modules = array_merge([$modules[0]], [$modules2[0]]);
        $this->assertFalse($user->can_access_modules($modules));
    }

    /** @test */
    function can_access_either_modules() {
        $user = User::factory()
            ->has(Group::factory(2)->has(Module::factory(2)))
            ->create();

        $user2 = User::factory()
            ->has(Group::factory()->has(Module::factory()))
            ->create();

        $this->actingAs($user);

        $modules = $user->modules()->take(2)->pluck("uid")->toArray();
        $modules2 = $user2->modules()->take(1)->pluck("uid")->toArray();

        $this->assertTrue($user->can_access_either_modules($modules));
        $this->assertTrue($user->can_access_either_modules($modules[0]));
        $this->assertFalse($user->can_access_either_modules($modules2));

        $modules = array_merge([$modules[0]], [$modules2[0]]);
        $this->assertTrue($user->can_access_either_modules($modules));
    }

    /** @test */
    function get_user_modules() {
        $user = User::factory()
            ->has(Group::factory(3)->has(Module::factory(5)))
            ->create();

        $another_user = User::factory()
            ->has(Group::factory(3)->has(Module::factory(5)))
            ->create();

        $this->actingAs($user);
        $this->assertCount(15, $user->modules());
    }

    /** @test */
    function root_access_all_modules() {
        $user = $this->login_as_root();

        $this->assertTrue($user->can_access_either_modules("xxx"));
    }
}
