<?php

use Modules\About\Module;

$module = resolve(Module::class);

return [
    "depends_on" => [],
    "router" => [
        "prefix" => $module->route_prefix(),
        "namespace" => "\Modules\About\Http\Controllers",
        "middleware" => ["web", "auth", "access"],
    ],
];
