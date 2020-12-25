<?php

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/_/about",
        "namespace" => "\Modules\About\Http\Controllers",
        "middleware" => ["auth:web,access-token", "access_About"],
    ],
    "abilities" => [
        "access_index" => "Access index page",
        "quia_est" => "Iste iste id deleniti a eum sequi quas sit.",
        "neque_voluptatem" => "Facilis sed possimus est vel eum hic eos.",
        "aut_quia" => "Ab accusamus et autem.",
        "et_cumque" => "Nam magnam quis eaque amet et.",
    ],
];
