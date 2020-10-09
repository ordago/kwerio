<?php

use Modules\About\Module;

$module = resolve(Module::class);

return [
    "router" => [
        "prefix" => $module->route_prefix(),
        "namespace" => "\Modules\About\Http\Controllers",
        "middleware" => ["web", "auth"],
    ],
];
