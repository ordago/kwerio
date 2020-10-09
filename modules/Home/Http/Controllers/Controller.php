<?php declare(strict_types=1);

namespace Modules\Home\Http\Controllers;

use App\Http\Controllers\Controller as BaseController;
use Modules\Home\Module;

class Controller extends BaseController {
    /**
     * Show the home page.
     *
     * @return View
     */
    function index(Module $module) {
        return view($module->view("index"));
    }
}
