<?php

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/_/basic-authentication",
        "namespace" => "\Modules\BasicAuthentication\Http\Controllers",
        "middleware" => ["web"],
    ],
];
