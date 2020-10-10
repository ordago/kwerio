<?php

use App\Http\Controllers\{
    MetadataController,
    Account\Permissions\UserController,
};

Route::middleware(["auth"])->group(function() {
    // -------------------------------------------------------------- WEB -- #
    Route::prefix("account")->group(function() {
        Route::get("/permissions/users", [UserController::class, "index"]);
    });

    // -------------------------------------------------------------- API -- #
    Route::prefix("api")->group(function() {
        Route::get("/metadata", [MetadataController::class, "index"]);

        Route::prefix("account")->group(function() {
            Route::post("/permissions/users", [UserController::class, "paginate"]);
        });
    });
});
