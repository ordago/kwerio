<?php declare(strict_types=1);

namespace Tests\Unit\Base\Module;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Base\Module\Maker;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;

class MakerTest extends TestCase {
    use WithFaker, RefreshDatabase;

    /** @test */
    function sync() {
        $name1 = $this->faker->words(mt_rand(2, 5), true);
        $name2 = $this->faker->words(mt_rand(2, 5), true);

        try {
            $maker = resolve(Maker::class);
            $maker->make($name1);
            $maker->make($name2);
            $maker->create_from_path("About");

            $models = $maker->sync();

            $this->assertDatabaseHas("modules", ["name" => $name1]);
            $this->assertDatabaseHas("modules", ["name" => $name2]);
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->cleanup(null, $name1);
            $this->cleanup(null, $name2);
        }
    }

    /** @test */
    function create_from_non_existing_path() {
        $this->expectException(\Exception::class);
        $name = $this->faker->words(mt_rand(2, 5), true);

        try {
            resolve(Maker::class)->create_from_path("/foo/bar");
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->cleanup(null, $name);
        }
    }

    /** @test */
    function create_from_path() {
        $name = $this->faker->words(mt_rand(2, 5), true);

        try {
            $maker = resolve(Maker::class);
            $module = $maker->make($name);
            $maker->create_from_path($module->path);
            $this->assertDatabaseHas("modules", [
                "name" => $name,
            ]);
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->cleanup(null, $name);
        }
    }

    /** @test */
    function create() {
        $name = $this->faker->words(mt_rand(2, 5), true);

        try {
            resolve(Maker::class)->create($name);
            $this->assertDatabaseHas("modules", [
                "name" => $name,
            ]);
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->cleanup(null, $name);
        }
    }

    /** @test */
    function make_path_exists() {
        $this->expectException(\Exception::class);
        resolve(Maker::class)->make("basic authentication");
    }

    /** @test */
    function make() {
        $name = $this->faker->words(mt_rand(2, 5), true);
        $module = null;

        try {
            $module = resolve(Maker::class)->make($name);
            $this->assertInstanceOf("Modules\\" . Str::studly($name) . "\Module", $module);
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->cleanup($module, $name);
        }
    }

    /**
     * Remove module from disk.
     *
     * @param Module $module
     * @param string $name
     */
    private function cleanup($module, $name) {
        $path = base_path("modules/" . Str::studly($name));
        if ($module) $path = $module->path;

        if (file_exists($path)) {
            $fs = resolve(Filesystem::class);
            $fs->deleteDirectory($path);
        }
    }
}
