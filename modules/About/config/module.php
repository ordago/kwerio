<?php

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/_/about",
        "namespace" => "\Modules\About\Http\Controllers",
        "middleware" => ["web", "auth:web,access-token", "access_About"],
    ],
];
