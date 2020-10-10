<?php

use App\Http\Controllers\{
    MetadataController,
};

Route::prefix("api")
    ->middleware(["web", "auth"])
    ->group(function() {
        Route::get("/metadata", [MetadataController::class, "index"]);
    });
