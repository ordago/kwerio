<?php

use Modules\Home\Http\Controllers\{
    Controller,
    MetadataController,
};

Route::middleware("auth", "access.module:Home")->group(function() {
    Route::get("/", [Controller::class, "index"]);

    Route::prefix("/_/home/api")->group(function() {
        Route::get("metadata", [MetadataController::class, "index"]);
    });
});
