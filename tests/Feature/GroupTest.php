<?php

namespace Tests\Feature;

use Illuminate\Support\Str;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\{
    Module,
    Group,
    User,
    Ability,
};

class GroupTest extends TestCase {
    use WithFaker, RefreshDatabase;

    /** @test */
    function abilities() {
        $user = User::factory()
            ->has(Group::factory(3)->has(Module::factory(5)))
            ->create();

        Module::get()->map(function($module) {
            foreach (range(1, 3) as $_) {
                Ability::create([
                    "name" => "{$module->uid}/" . Str::slug($this->faker->sentence, "_"),
                    "description" => $this->faker->sentence,
                ]);
            }
        });

        $abilities = collect();

        $user->groups->each(function($group) use($abilities) {
            foreach ($group->abilities() as $ability) {
                $abilities->push($ability);
            }
        });

        $this->assertCount(3 * 5 * 3, $abilities);
    }

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
