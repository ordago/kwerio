<?php declare(strict_types=1);

use Modules\Home\Module;

$module = resolve(Module::class);

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/",
        "namespace" => "\Modules\Home\Http\Controllers",
        "middleware" => ["web", "auth", "access_Home"],
    ],
];
