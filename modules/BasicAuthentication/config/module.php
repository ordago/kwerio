<?php declare(strict_types=1);

use Modules\BasicAuthentication\Module;

$module = resolve(Module::class);

return [
    "router" => [
        "prefix" => $module->route_prefix(),
        "namespace" => "\Modules\BasicAuthentication\Http\Controllers",
        "middleware" => ["web"],
    ],
];
