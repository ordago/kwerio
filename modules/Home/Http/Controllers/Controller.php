<?php

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
        return $module->view("index");
    }
}
