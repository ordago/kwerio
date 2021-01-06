<?php

namespace Tests\Unit;

use Tests\TestCase;
use Kwerio\Normalizer;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;

class NormalizerTest extends TestCase {
    use WithFaker, RefreshDatabase;

    /** @test */
    function normalize_pagintor() {
        Config::set("app.per_page", 5);
        User::factory(32)->create();

        $norm = resolve(Normalizer::class);
        $paginator = User::paginate(5);

        $data = $norm->normalize($paginator, function($item) {
            return ["email" => $item->email];
        });

        $this->assertEquals($data["total"], 32);
        $this->assertEquals($data["current_page"], 1);
        $this->assertEquals($data["next_page"], 2);
        $this->assertEquals($data["last_page"], 7);
    }

    /** @test */
    function normalize_collection_of_models() {
        Config::set("app.per_page", 5);
        User::factory(32)->create();

        $users = User::take(5)->get();
        $norm = resolve(Normalizer::class);
        $data = $norm->normalize($users, function($item) {
            return ["email" => $item->email];
        });

        $this->assertEquals($data["total"], 32);
        $this->assertEquals($data["current_page"], 1);
        $this->assertEquals($data["next_page"], 2);
        $this->assertEquals($data["last_page"], 7);
    }

    /** @test */
    function normalize_single_model() {
        Config::set("app.per_page", 3);

        $users = User::factory(32)->create();
        $norm = resolve(Normalizer::class);

        $data = $norm->normalize($users->first(), function($item) {
            return ["email" => $item->email];
        });

        $this->assertEquals($data["total"], 32);
        $this->assertEquals($data["current_page"], 1);
        $this->assertEquals($data["next_page"], 1);
        $this->assertEquals($data["last_page"], 1);
    }
}
