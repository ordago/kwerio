<?php

namespace Kwerio\Metadata;

trait InteractsWithModule {
    /**
     * Module metadata.
     *
     * @return array
     */
    function module() {
        $module = resolve("module");

        $this->attributes["module"] = [
            "name" => $module->name,
            "slug" => $module->slug,
            "uid" => $module->uid,
        ];

        return $this;
    }
}
