<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MetadataController extends Controller {
    function index() {
        $modules = $this->_get_modules();

        dd($modules);

        return compact("modules");
    }

    private function _get_modules() {
        return collect(config("modules"))
            ->map(function($item) {
                return [
                    "name" => $item["module"]->name,
                    "uid" => $item["module"]->uid,
                    "slug" => $item["module"]->slug,
                    "endpoint" => $item["module"]->route_prefix(),
                ];
            });
    }
}
