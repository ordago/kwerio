<?php

namespace Kwerio\Metadata;

trait InteractsWithModule {
    /**
     * Module metadata.
     *
     * @return array
     */
    function module() {
        $module = config("module");

        if (empty($module)) {
            return [];
        }

        $class = "Modules\\{$module}\\Module";
        $module = new $class;

        return [
            "name" => $module->name,
            "slug" => $module->slug,
            "uid" => $module->uid,
        ];
    }
}
