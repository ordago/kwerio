<?php declare(strict_types=1);

namespace Modules\About\Http\Controllers;

use App\Http\Controllers\Controller as BaseController;
use Modules\About\Module;

class Controller extends BaseController {
    function index(Module $module) {
        return $module->view("index");
    }
}
