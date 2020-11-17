<?php

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/_/login",
        "namespace" => "\Modules\Login\Http\Controllers",
        "middleware" => ["web"],
    ],
];
