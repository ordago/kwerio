<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Filesystem\Filesystem;
use App\Base\Module\Loader;
use Illuminate\Foundation\Testing\RefreshDatabase;

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

        foreach ($this->dummy as $dir => $deps) {
            $this->_create_module($dir, $deps);
        }
    }

    protected function tearDown(): void {
        parent::tearDown();

        $dummy = array_merge(
            $this->dummy,
            [
                "FooDup" => [],
            ],
        );

        foreach ($dummy as $dir => $deps) {
            $this->_remove_module($dir);
        }
    }

    /**
     * @test
     */
    function fail_if_duplicated_module_found() {
        $this->expectException(\Exception::class);

        $this->_create_module("FooDup");
        $module_content = $this->_get_module("FooDup", "public \$uid = 'module__foo';");
        file_put_contents(base_path("modules/FooDup/Module.php"), $module_content);

        $ml = resolve(ModulesLoader::class);
        $ml->load_from_disk();
    }

    /** @test */
    function it_pass() {
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
    }

    /**
     * Get a mocked config file content.
     *
     * @return string
     */
    function _get_config($in_namespace, $_depends_on = null) {
        $depends_on = "";

        if (!is_null($_depends_on)) {
            $depends_on = Arr::wrap($_depends_on);
            $depends_on = "['" . implode("', '", $depends_on) . "']";
            $depends_on = "'depends_on' => {$depends_on}";
        }

        return "
            <?php
            use Modules\\{$in_namespace}\Module;
            return [ {$depends_on} ];
        ";
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
     * Get module service provider.
     *
     * @param string $in_namespace
     * @return string
     */
    function _get_service_provider($in_namespace) {
        return "<?php
            namespace Modules\\{$in_namespace};
            use Illuminate\Support\ServiceProvider as BaseServiceProvider;
            class ServiceProvider extends BaseServiceProvider {
                function register() { }
                function boot() { }
            }
        ";
    }

    /**
     * Remove module.
     *
     * @param string $dir
     */
    private function _remove_module($dir) {
        $filesystem = resolve(Filesystem::class);
        $filesystem->deleteDirectory(base_path("modules/{$dir}"));
    }

    /**
     * Create a new module.
     *
     * @param string $dir
     * @param array  $deps
     */
    private function _create_module($dir, $deps = null) {
        @mkdir(base_path("modules/{$dir}"));
        @mkdir(base_path("modules/{$dir}/config"));

        file_put_contents(
            base_path("modules/{$dir}/config/module.php"),
            $this->_get_config($dir, $deps)
        );

        file_put_contents(
            base_path("modules/{$dir}/Module.php"),
            $this->_get_module($dir)
        );

        file_put_contents(
            base_path("modules/{$dir}/ServiceProvider.php"),
            $this->_get_service_provider($dir)
        );
    }
}
