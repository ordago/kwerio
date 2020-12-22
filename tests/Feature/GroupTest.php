<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\{
    Group,
    User,
};

class GroupTest extends TestCase {
    use WithFaker, RefreshDatabase;

    /** @test */
    function is_root() {
        $user = User::factory()
            ->has(Group::factory(["name" => "root", "slug" => "root"]))
            ->create();

        $this->assertTrue($user->is_root());

        $user = User::factory()
            ->has(Group::factory(["name" => "rootx", "slug" => "rootx"]))
            ->create();

        $this->assertFalse($user->is_root());
    }

    /** @test */
    function member_of() {
        $user = User::factory()
            ->has(Group::factory(3))
            ->create();

        $groups = $user->groups->pluck("slug")->toArray();
        $this->assertTrue($user->member_of($groups));
        $this->assertFalse($user->member_of(array_merge($groups, ["xxx"])));
    }

    /** @test */
    function member_of_either() {
        $user = User::factory()
            ->has(Group::factory(3))
            ->create();

        $groups = $user->groups->pluck("slug")->toArray();
        $this->assertTrue($user->member_of_either($groups));
        $this->assertTrue($user->member_of_either([$groups[0], "xxx"]));
        $this->assertTrue($user->member_of_either($groups[0]));
        $this->assertFalse($user->member_of_either("xxx"));
    }
}
