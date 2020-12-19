<?php

use App\Http\Controllers\{
    MetadataController,
    LogoutController,
    ProfileController,
    Account\Permissions\UserController,
    Account\Permissions\AccessTokenController,
    Account\Permissions\GroupController,
    Account\Settings\AccountController,
    Account\ModuleController,
};

Route::middleware(["auth"])->group(function() {

    // -------------------------------------------------------------- WEB -- #
    Route::get("/logout", [LogoutController::class, "logout"]);
    Route::get("/profile", [ProfileController::class, "show_page"]);

    // -------------------------------------------------------------- API -- #
    Route::prefix("api")->group(function() {
        Route::get("/metadata", [MetadataController::class, "index"]);
    });
});

Route::middleware(["auth", "owner-only"])->group(function() {
    // -------------------------------------------------------------- WEB -- #
    Route::prefix("account")->group(function() {

        // ---------------------------------------- ACCOUNT / PERMISSIONS -- #
        Route::prefix("permissions")->group(function() {
            Route::get("/groups", [GroupController::class, "show_index_page"]);
            Route::get("/groups/create", [GroupController::class, "show_create_page"]);
            Route::get("/groups/{uuid}", [GroupController::class, "show_update_page"]);

            Route::get("/users", [UserController::class, "show_index_page"]);
            Route::get("/users/create", [GroupController::class, "show_create_page"]);
            Route::get("/users/{uuid}", [GroupController::class, "show_update_page"]);

            Route::get("/access-tokens", [AccessTokenController::class, "show_index_page"]);
            Route::get("/access-tokens/create", [AccessTokenController::class, "show_create_page"]);
            Route::get("/access-tokens/{uuid}", [AccessTokenController::class, "show_update_page"]);
        });

        // ------------------------------------------- ACCOUNT - SETTINGS -- #
        Route::prefix("settings")->group(function() {
            Route::get("/account", [AccountController::class, "show_page"]);
        });
    });

    Route::prefix("modules")->group(function() {
        Route::get("/", [ModuleController::class, "index"]);
    });

    // -------------------------------------------------------------- API -- #
    Route::prefix("api")->group(function() {
        Route::prefix("account")->group(function() {

            // ------------------------------------ ACCOUNT / PERMISSIONS -- #
            Route::prefix("permissions")->group(function() {
                Route::post("/groups", [GroupController::class, "index"]);
                Route::post("/groups/create", [GroupController::class, "create"]);
                Route::post("/groups/update", [GroupController::class, "update"]);
                Route::post("/groups/fetch-by-uuid", [GroupController::class, "fetch_by_uuid"]);
                Route::post("/groups/all", [GroupController::class, "all"]);

                Route::post("/users", [UserController::class, "index"]);
                Route::post("/users/create", [UserController::class, "create"]);
                Route::post("/users/update", [UserController::class, "update"]);
                Route::post("/users/fetch-by-uuid", [UserController::class, "fetch_by_uuid"]);
                Route::post("/users/metadata", [UserController::class, "metadata"]);

                Route::post("/access-tokens", [AccessTokenController::class, "index"]);
                Route::post("/access-tokens/create", [AccessTokenController::class, "create"]);
                Route::post("/access-tokens/update", [AccessTokenController::class, "update"]);
                Route::post("/access-tokens/fetch-by-uuid", [AccessTokenController::class, "fetch_by_uuid"]);
            });
        });

        Route::prefix("modules")->group(function() {
            Route::post("/", [ModuleController::class, "paginate"]);
            Route::post("/all", [ModuleController::class, "all"]);
        });
    });
});
