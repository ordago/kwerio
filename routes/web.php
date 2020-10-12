<?php

use App\Http\Controllers\{
    MetadataController,
    Account\Permissions\UserController,
    Account\Permissions\GroupController,
    Account\ModuleController,
};

Route::middleware(["auth"])->group(function() {
    // -------------------------------------------------------------- WEB -- #
    Route::prefix("account")->group(function() {
        Route::get("/permissions/groups", [GroupController::class, "index"]);
        Route::get("/permissions/users", [UserController::class, "index"]);
    });

    Route::prefix("modules")->group(function() {
        Route::get("/", [ModuleController::class, "index"]);
    });

    // -------------------------------------------------------------- API -- #
    Route::prefix("api")->group(function() {
        Route::get("/metadata", [MetadataController::class, "index"]);

        Route::prefix("account")->group(function() {
            Route::get("/permissions/groups/metadata", [GroupController::class, "metadata"]);
            Route::post("/permissions/groups", [GroupController::class, "paginate"]);
            Route::post("/permissions/users", [UserController::class, "paginate"]);
        });

        Route::prefix("modules")->group(function() {
            Route::post("/", [ModuleController::class, "paginate"]);
        });
    });
});
