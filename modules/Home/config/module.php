<?php

return [
    "depends_on" => [],
    "router" => [
        "prefix" => "/",
        "namespace" => "\Modules\Home\Http\Controllers",
        "middleware" => ["web", "auth", "access_Home"],
    ],
    "abilities" => [
        "sapiente_enim" => "Soluta et ea distinctio velit quia et magni tenetur.",
        "eos_iure" => "Quae beatae sit quasi unde perspiciatis dolor.",
        "debitis_omnis" => "Et error autem et quis.",
        "et_ea" => "Minus sunt nemo iste totam cumque sunt rerum.",
        "quia_ipsa" => "Soluta autem quia exercitationem voluptatem.",
    ],
];
