<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;

class MetadataController extends Controller {
    function index() {
        $modules = $this->_get_modules();

        return [
            "menu" => [
                "open" => false,
                "data" => [
                    [
                        "id" => Str::uuid(),
                        "text" => "Applications",
                        "children" => $modules,
                    ]
                ],
            ],
        ];
    }

    private function _get_modules() {
        return collect(config("modules"))
            ->map(function($item) {
                return [
                    "id" => Str::uuid(),
                    "position" => $item["module"]->position,
                    "uid" => $item["module"]->uid,
                    "text" => $item["module"]->name,
                    "link" => $item["module"]->route_prefix(),
                    "hidden" => $item["module"]->hidden,
                    "icon" => $item["module"]->icon,
                ];
            })
            ->filter(function($item) { return !$item["hidden"]; })
            ->sortBy("position")
            ->values();
    }
}
