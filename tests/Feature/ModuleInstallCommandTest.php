<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use App\Base\Module\Maker;

class ModuleInstallCommandTest extends TestCase {
    use RefreshDatabase, WithFaker;

    /** @test */
    function invalid_argument() {
        $this->expectException(\Exception::class);

        Artisan::call("module:install");
    }

    /** @test */
    function install_by_name() {
        $name = $this->faker->words(mt_rand(2, 5), true);
        $dir = Str::studly($name);

        Artisan::call("module:install", [
            "name" => $name,
        ]);

        $this->assertTrue(file_exists(base_path("modules/{$dir}")));
        $this->assertDatabaseHas("modules", [ "name" => $name ]);
    }

    /** @test */
    function install_by_path() {
        $name = $this->faker->words(mt_rand(2, 5), true);
        $maker = resolve(Maker::class);
        $module = $maker->make($name);

        Artisan::call("module:install", [
            "--path" => $module->path,
        ]);

        $this->assertDatabaseHas("modules", [ "name" => $name ]);
    }
}
