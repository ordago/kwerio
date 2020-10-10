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
                    ],
                    [
                        "id" => Str::uuid(),
                        "text" => "Account",
                        "children" => [
                            [
                                "id" => Str::uuid(),
                                "text" => "Permissions",
                                "icon" => "lock",
                                "link" => "#",
                                "open" => false,
                                "children" => [
                                    [
                                        "id" => Str::uuid(),
                                        "text" => "Groups",
                                        "link" => "/account/permissions/groups",
                                    ],
                                    [
                                        "id" => Str::uuid(),
                                        "text" => "Users",
                                        "link" => "/account/permissions/users",
                                    ],
                                ],
                            ],
                            [
                                "id" => Str::uuid(),
                                "text" => "Settings",
                                "icon" => "settings",
                                "link" => "#",
                                "open" => false,
                                "children" => [
                                    [
                                        "id" => Str::uuid(),
                                        "text" => "Services",
                                        "link" => "/account/settings/services",
                                    ],
                                    [
                                        "id" => Str::uuid(),
                                        "text" => "Styling",
                                        "link" => "/account/settings/styling",
                                    ],
                                    [
                                        "id" => Str::uuid(),
                                        "text" => "Account",
                                        "link" => "/account/settings/account",
                                    ]
                                ],
                            ],
                            [
                                "id" => Str::uuid(),
                                "text" => "Billing",
                                "icon" => "money",
                                "link" => "#",
                            ],
                        ],
                    ],
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
