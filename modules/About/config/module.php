<?php

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/_/about",
        "namespace" => "\Modules\About\Http\Controllers",
        "middleware" => ["auth", "access:About"],
    ],
    "abilities" => [

    ],
];
