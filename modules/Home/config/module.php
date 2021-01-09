<?php

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/",
        "namespace" => "\Modules\Home\Http\Controllers",
        "middleware" => ["auth", "access.module:Home"],
    ],
    "abilities" => [

    ],
];
