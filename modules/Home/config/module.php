<?php

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/",
        "namespace" => "\Modules\Home\Http\Controllers",
        "middleware" => ["access.module:Home"],
    ],
    "abilities" => [

    ],
];
