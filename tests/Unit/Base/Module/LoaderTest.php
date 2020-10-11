<?php

namespace Tests\Unit;

use Illuminate\Support\Str;
use Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Module as ModuleModel;
use App\Base\Module\{
    Loader,
    Maker,
};

class LoaderTest extends TestCase {
    use RefreshDatabase;

    private $dummy = [
        "Foo" => null,
        "Bar" => "Foo",
        "Baz" => ["Bar", "Foo"],
        "Qux" => ["Baz", "Bar", "Foo"],
        "Quux" => ["Qux"],
    ];

    protected function setUp(): void {
        parent::setUp();

        $maker = resolve(Maker::class);

        foreach ($this->dummy as $dir => $deps) {
            $maker->make($dir, $deps);
        }
    }

    /**
     * @test
     */
    function fail_if_duplicated_module_found() {
        $this->expectException(\Exception::class);
        $this->dummy["FooDup"] = [];

        try {
            $maker = resolve(Maker::class);
            $maker->make("FooDup");

            $module_content = $this->_get_module("FooDup", "public \$uid = 'module__foo';");
            file_put_contents(base_path("modules/FooDup/Module.php"), $module_content);

            $ml = resolve(ModulesLoader::class);
            $ml->load_from_disk();
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->_cleanup();
        }
    }

    /** @test */
    function it_pass() {
        try {
            $ml = resolve(Loader::class);
            $modules = $ml->load_from_disk();
            $expected = ["Foo", "Bar", "Baz", "Qux", "Quux"];
            $results = [];

            foreach ($modules as $i => $module) {
                if (in_array($module["basename"], $expected)) {
                    $results[] = $module["basename"];
                }
            }

            $this->assertEquals($results, $expected);
        } catch (\Throwable $e) {
            throw $e;
        } finally {
            $this->_cleanup();
        }
    }

    /**
     * Get a mocked module content.
     *
     * @return string
     */
    function _get_module($name, $extra = "") {
        return "<?php
            namespace Modules\\{$name};
            use App\Base\Module\Base as BaseModule;
            class Module extends BaseModule {
                public \$name = '{$name}';
                {$extra}
            }
        ";
    }

    /**
     * Remove module.
     *
     * @param string $dir
     */
    private function _cleanup() {
        foreach ($this->dummy as $dir => $deps) {
            if (!empty($dir) && file_exists(base_path("modules/{$dir}"))) {
                $filesystem = resolve(Filesystem::class);
                $filesystem->deleteDirectory(base_path("modules/{$dir}"));
            }

            ModuleModel::whereUid("module__" . Str::slug($dir, '_'))->delete();
        }
    }
}
