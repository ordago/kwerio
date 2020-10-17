<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;

class MetadataController extends Controller {
    /**
     * Get the metadata required to render dashboard.
     *
     * @return array
     */
    function index() {
        $applications_menu = $this->_get_applications_menu();
        $permissions_menu = $this->_get_permissions_menu();
        $settings_menu = $this->_get_settings_menu();
        $modules_menu = $this->_get_modules_menu();

        return [
            "menu" => [
                "open" => false,
                "data" => [
                    [
                        "id" => Str::uuid(),
                        "text" => "Applications",
                        "children" => $applications_menu,
                    ],
                    [
                        "id" => Str::uuid(),
                        "text" => "Account",
                        "children" => array_values(array_filter([
                            $permissions_menu,
                            $settings_menu,
                            $modules_menu,
                        ], function($menu) {
                            return !empty($menu);
                        })),
                    ],
                ],
            ],
        ];
    }

    /**
     * Get accessable applications.
     *
     * @return array
     */
    private function _get_applications_menu() {
        $user = request()->user();

        return collect(config("modules"))
            ->filter(function($item) use($user) {
                if (
                    $user->can_access_module($item["module"]->uid)
                    && $item["module"]->hidden !== false
                ) {
                    return true;
                }

                return false;
            })
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
            ->sortBy("position")
            ->values();
    }

    /**
     * Get accessable permissions menu.
     *
     * @return array
     */
    private function _get_permissions_menu() {
        if (request()->user()->is_owner()) {
            return [
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
            ];
        }

        return [];
    }

    /**
     * Get accessable settings menu.
     *
     * @return array
     */
    private function _get_settings_menu() {
        return [
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
        ];
    }

    /**
     * Get accessable modules menu.
     *
     * @return array
     */
    private function _get_modules_menu() {
        // if (request()->user()->is_owner()) {
        //     return [
        //         "id" => Str::uuid(),
        //         "text" => "Modules",
        //         "icon" => "widgets",
        //         "link" => "/modules",
        //     ];
        // }

        return [];
    }
}
