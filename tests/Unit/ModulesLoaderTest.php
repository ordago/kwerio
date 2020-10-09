<?php

namespace Tests\Unit;

use Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Filesystem\Filesystem;
use App\Opt\ModulesLoader;

class ModulesLoaderTest extends TestCase {
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
        }
    }

    protected function tearDown(): void {
        parent::tearDown();

        $filesystem = resolve(Filesystem::class);

        foreach ($this->dummy as $dir => $deps) {
            $filesystem->deleteDirectory(base_path("modules/{$dir}"));
        }
    }

    /** @test */
    function it_pass() {
        $ml = resolve(ModulesLoader::class);
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
    function _get_module($name) {
        return "<?php
            namespace Modules\\{$name};
            use App\Opt\Module as BaseModule;
            class Module extends BaseModule {
                public \$name = '{$name}';
            }
        ";
    }
}
