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
        $perms = $this->_build_permissions();

        $data = [
            [
                "id" => Str::uuid(),
                "text" => "Applications",
                "children" => $apps,
            ],
        ];

        if (count($perms) || count($this->settings)) {
            $data[] = [
                "id" => Str::uuid(),
                "text" => "Account",
                "children" => array_values(array_filter([
                    $perms,
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
     * Build permissions menu.
     */
    private function _build_permissions() {
        $user = request()->user();

        if ($user->is_root()) {
            $groups = [];
            $users = [];
            $api_users = [];

            if ($user->canAny(["root/user_index", "root/user_create"])) {
                $users = [
                    "id" => Str::uuid(),
                    "text" => "Users",
                    "link" => $link = "/account/permissions/users",
                    "matches" => [ $link, "{$link}/create", "{$link}/:uuid" ],
                ];
            }

            if ($user->canAny(["root/group_index", "root/group_create"])) {
                $groups = [
                    "id" => Str::uuid(),
                    "text" => "Groups",
                    "link" => $link = "/account/permissions/groups",
                    "matches" => [ $link, "{$link}/create", "{$link}/:uuid" ],
                ];
            }

            if ($user->canAny(["root/api_user_index", "root/api_user_create"])) {
                $api_users = [
                    "id" => Str::uuid(),
                    "text" => "Api Users",
                    "link" => $link = "/account/permissions/api-users",
                    "matches" => [ $link, "{$link}/create", "{$link}/:uuid" ],
                ];
            }

            if (empty($groups) && empty($users) && empty($api_users)) {
                return [];
            }

            return [
                "id" => Str::uuid(),
                "text" => "Permissions",
                "icon" => "lock",
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
