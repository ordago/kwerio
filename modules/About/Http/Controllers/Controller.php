<?php declare(strict_types=1);

namespace Modules\About\Http\Controllers;

use App\Http\Controllers\Controller as BaseController;
use Modules\About\Module;

class Controller extends BaseController {
    /**
     * Show index page.
     *
     * @param Module $module
     * @return View
     */
    function show_index_page(Module $module) {
        return $module->view("index");
    }

    /**
     * Get information about kwerio.
     *
     * @return array
     */
    function index() {
        return [
            "authors" => [
                "Oussama Elgoumri <euvoor@gmail.com>",
                "Philippe Kaivers <philippe@imageplus.be>",
            ],
        ];
    }
}
