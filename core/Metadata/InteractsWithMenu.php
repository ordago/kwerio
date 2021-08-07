<?php

namespace Kwerio\Metadata;

use Illuminate\Support\Str;
use App\Models\Module as ModuleModel;

trait InteractsWithMenu {
    /**
     * Set user accessable menu.
     */
    function menu() {
        $apps = $this->_build_apps();
        $admission = $this->_build_admission();

        $data = [
            [
                "id" => Str::uuid(),
                "text" => "Applications",
                "children" => $apps,
            ],
        ];

        if ($admission && count($admission)) {
            $data[] = [
                "id" => Str::uuid(),
                "text" => "LordLand",
                "children" => array_values(array_filter([
                    $admission,
                ], function($menu) { return !empty($menu); })),
            ];
        }

        $this->attributes["menu"] = [
            "open" => false,
            "data" => $data,
        ];

        return $this;
    }

    /**
     * Build applications menu.
     */
    private function _build_apps() {
        $_modules = resolve("modules")->authorized();
        $modules = collect();

        foreach ($_modules as $module) {
            $modules[] = [
                "id" => Str::uuid(),
                "position" => $module->position,
                "uid" => $module->uid,
                "uuid" => $module->uuid,
                "text" => $module->name,
                "link" => $module->slug,
                "hidden" => $module->hidden,
                "icon" => $module->icon,
            ];
        }

        return $modules
            ->where("hidden", false)
            ->sortBy("position")
            ->values();
    }

    /**
     * Build admission menu.
     */
    private function _build_admission() {
        $user = request()->user();

        if ($user->is_root()) {
            $groups = [];
            $users = [];
            $api_users = [];

            if ($user->canAny(["root/user_index", "root/user_create"])) {
                $users = [
                    "id" => Str::uuid(),
                    "text" => "Users",
                    "icon" => "people",
                    "link" => $link = "/lordland/admission/users",
                    "matches" => [ $link, "{$link}/create", "{$link}/:uuid" ],
                ];
            }

            if ($user->canAny(["root/group_index", "root/group_create"])) {
                $groups = [
                    "id" => Str::uuid(),
                    "text" => "Groups",
                    "icon" => "groups",
                    "link" => $link = "/lordland/admission/groups",
                    "matches" => [ $link, "{$link}/create", "{$link}/:uuid" ],
                ];
            }

            if ($user->canAny(["root/api_user_index", "root/api_user_create"])) {
                $api_users = [
                    "id" => Str::uuid(),
                    "text" => "Api Users",
                    "icon" => "api",
                    "link" => $link = "/lordland/admission/api-users",
                    "matches" => [ $link, "{$link}/create", "{$link}/:uuid" ],
                ];
            }

            if (empty($groups) && empty($users) && empty($api_users)) {
                return [];
            }

            return [
                "id" => Str::uuid(),
                "text" => "Admission",
                "icon" => "admin_panel_settings",
                "link" => "#",
                "open" => false,
                "children" => array_values(array_filter([
                    $groups,
                    $users,
                    $api_users,
                ], function($item) { return !empty($item); })),
            ];
        }
    }
}
