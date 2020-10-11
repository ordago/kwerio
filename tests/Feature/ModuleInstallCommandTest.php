<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use App\Base\Module\Maker;
use Illuminate\Filesystem\Filesystem;

class ModuleInstallCommandTest extends TestCase {
    use RefreshDatabase, WithFaker;

    /** @test */
    function module_has_dependencies() {
        $name = $this->faker->words(mt_rand(2, 5), true);
        $dep1 = $this->faker->words(mt_rand(2, 5), true);
        $dep2 = $this->faker->words(mt_rand(2, 5), true);

        try {
            $maker = resolve(Maker::class);
            $maker->create($dep1);
            $maker->create($dep2);

            Artisan::call("module:install", [
                "name" => $name,
                "--dependency" => [$dep1, Str::studly($dep2)],
            ]);

            $this->assertDatabaseHas("modules", [ "name" => $name ]);
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->cleanup($name);
            $this->cleanup($dep1);
            $this->cleanup($dep2);
        }
    }

    /** @test */
    function invalid_argument() {
        $this->expectException(\Exception::class);

        Artisan::call("module:install");
    }

    /** @test */
    function install_by_name() {
        $name = $this->faker->words(mt_rand(2, 5), true);
        $dir = Str::studly($name);

        try {
            Artisan::call("module:install", [
                "name" => $name,
            ]);

            $this->assertTrue(file_exists(base_path("modules/{$dir}")));
            $this->assertDatabaseHas("modules", [ "name" => $name ]);
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->cleanup($dir);
        }
    }

    /** @test */
    function install_by_path() {
        $name = $this->faker->words(mt_rand(2, 5), true);
        $maker = resolve(Maker::class);
        $module = $maker->make($name);

        try {
            Artisan::call("module:install", [
                "--path" => $module->path,
            ]);

            $this->assertDatabaseHas("modules", [ "name" => $name ]);
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->cleanup($name);
        }
    }

    private function cleanup($name) {
        $dir = Str::studly($name);

        if (file_exists(base_path("modules/{$dir}"))) {
            $filesystem = resolve(Filesystem::class);
            $filesystem->deleteDirectory(base_path("modules/{$dir}"));
        }
    }
}
