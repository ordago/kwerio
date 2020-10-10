<?php declare(strict_types=1);

namespace Modules\Home;

use App\Opt\Module as BaseModule;

class Module extends BaseModule {
    public $position = 1;
    public $name = "Home";
    public $icon = "home";
    public $slug = "/";
}
