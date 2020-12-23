<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\{
    Ability,
    User,
};

class AbilityTest extends TestCase {
    use WithFaker, RefreshDatabase;

    /** @test */
    function has_abilities() {
        $user = User::factory()
            ->has(Ability::factory(3))
            ->create();

        $abilities = $user->abilities->pluck("name")->toArray();
        $this->assertTrue($user->has_abilities($abilities));
        $this->assertTrue($user->has_abilities($abilities[0]));
        $this->assertFalse($user->has_abilities($abilities + [count($abilities) => "xxx"]));
    }

    /** @test */
    function has_either_abilities() {
        $user = User::factory()
            ->has(Ability::factory(3))
            ->create();

        $abilities = $user->abilities->pluck("name")->toArray();
        $this->assertTrue($user->has_either_abilities($abilities));
        $this->assertTrue($user->has_either_abilities($abilities[0]));

        $user2 = User::factory()
            ->has(Ability::factory(3))
            ->create();

        $abilities2 = $user2->abilities->pluck("name")->toArray();
        $this->assertFalse($user->has_either_abilities($abilities2));

        $this->assertTrue($user->has_either_abilities([$abilities[0], $abilities2[0]]));
    }
}
