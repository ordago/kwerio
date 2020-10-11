<?php declare(strict_types=1);

namespace Modules\Home;

use App\Base\Module\Base as BaseModule;

class Module extends BaseModule {
    public $name = "Home";
    public $position = 1;
    public $icon = "home";
    public $slug = "/";
}
