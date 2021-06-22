<?php

use Modules\Home\Http\Controllers\{
    Controller,
};

Route::get("/", function($tenant, $domain) {
    dump($tenant, $domain);
});

//Route::get("/", [Controller::class, "index"]);
