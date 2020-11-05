<?php

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/",
        "namespace" => "\Modules\Home\Http\Controllers",
        "middleware" => ["web", "auth", "access_Home"],
    ],
];
