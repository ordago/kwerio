<?php

namespace Modules\Http\Controllers\MetadataController;

use Illuminate\Support\Facades\Auth;

class MetadataController extends Controller {
    /**
     * Get module metadata.
     *
     * @return array
     */
    function index() {
        $module = config("modules")->where("uid", config("module"));
        $menu = $this->_menu();

        return compact("menu", "module");
    }

    /**
     * Get module menu.
     *
     * @return array
     */
    function _menu() {
        $user = Auth::user();

        return [];
    }
}
