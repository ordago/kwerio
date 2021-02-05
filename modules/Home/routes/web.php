<?php

use Modules\Home\Http\Controllers\{
    Controller,
};

Route::middleware("auth", "access.module:Home")->group(function() {
    Route::get("/", [Controller::class, "index"]);

    Route::prefix("/_/home/api")->group(function() {

    });
});
