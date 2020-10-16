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
        Route::get("/permissions/groups", [GroupController::class, "show_page"]);
        Route::get("/permissions/groups/create", [GroupController::class, "show_create_page"]);
        Route::get("/permissions/groups/{uuid}", [GroupController::class, "show_update_page"]);

        Route::get("/permissions/users", [UserController::class, "show_page"]);
        Route::get("/permissions/users/create", [GroupController::class, "show_create_page"]);
        Route::get("/permissions/users/{uuid}", [GroupController::class, "show_update_page"]);
    });

    Route::prefix("modules")->group(function() {
        Route::get("/", [ModuleController::class, "index"]);
    });

    // -------------------------------------------------------------- API -- #
    Route::prefix("api")->group(function() {
        Route::get("/metadata", [MetadataController::class, "index"]);

        Route::prefix("account")->group(function() {
            Route::post("/permissions/groups", [GroupController::class, "index"]);
            Route::post("/permissions/groups/create", [GroupController::class, "create"]);
            Route::post("/permissions/groups/update", [GroupController::class, "update"]);
            Route::post("/permissions/groups/fetch-by-uuid", [GroupController::class, "fetch_by_uuid"]);
            Route::post("/permissions/groups/all", [GroupController::class, "all"]);

            Route::post("/permissions/users", [UserController::class, "index"]);
            Route::post("/permissions/users/create", [UserController::class, "create"]);
            Route::post("/permissions/users/update", [UserController::class, "update"]);
            Route::post("/permissions/users/fetch-by-uuid", [UserController::class, "fetch_by_uuid"]);
            Route::post("/permissions/users/metadata", [UserController::class, "metadata"]);
        });

        Route::prefix("modules")->group(function() {
            Route::post("/", [ModuleController::class, "paginate"]);
            Route::post("/all", [ModuleController::class, "all"]);
        });
    });
});
