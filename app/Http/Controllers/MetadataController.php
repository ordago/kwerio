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
        $user_info = $this->_get_user_info();

        return [
            "user" => $user_info,
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
                        ], function($menu) {
                            return !empty($menu);
                        })),
                    ],
                ],
            ],
        ];
    }

    /**
     * Get information about the currently authenticated user.
     *
     * @return array
     */
    private function _get_user_info() {
        $user = request()->user();

        return [
            "uuid" => $user->uuid,
            "owner_at" => $user->owner_at,
            "is_owner" => $user->is_owner(),
            "email" => $user->email,
            "first_name" => $user->first_name ?? "",
            "last_name" => $user->last_name ?? "",
            "locale" => $user->locale,
            "timezone" => $user->timezone,
            "locale_iso_format" => $user->locale_iso_format,
            "is_rtl" => (bool) $user->is_rtl,
            "dir" => $user->is_rtl ? "rtl" : "ltr",
            "groups" => $user->get_groups_ids(),
            "modules" => $user->get_modules_ids(),
            "can_create_tokens" => $user->can_create_tokens,
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
            ->filter(function($module) use($user) {
                if ($user->can_access_module($module["uid"]) && (bool) $module["hidden"] === false) {
                    return true;
                }

                return false;
            })
            ->map(function($module) {
                return [
                    "id" => Str::uuid(),
                    "position" => $module["position"],
                    "uid" => $module["uid"],
                    "text" => $module["name"],
                    "link" => $module["slug"],
                    "hidden" => $module["hidden"],
                    "icon" => $module["icon"],
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
                    [
                        "id" => Str::uuid(),
                        "text" => "Access Tokens",
                        "link" => "/account/permissions/access-tokens",
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
}
