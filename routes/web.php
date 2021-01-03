<?php

use App\Http\Controllers\{
    MetadataController,
    LogoutController,
    ProfileController,
    Account\Permissions\UserController,
    Account\Permissions\ApiUserController,
    Account\Permissions\GroupController,
    Account\Settings\AccountController,
    Account\ModuleController,
};

Route::middleware(["auth"])->group(function() {
    Route::get("/logout", [LogoutController::class, "logout"]);
    Route::get("/profile", [ProfileController::class, "show_index_page"]);
});

Route::middleware(["auth", "root"])->group(function() {
    // ---------------------------------------------------------- ACCOUNT -- #
    Route::prefix("account")->group(function() {
        // ---------------------------------------- ACCOUNT / PERMISSIONS -- #
        Route::prefix("permissions")->group(function() {
            Route::get("/groups", [GroupController::class, "show_index_page"]);
            Route::get("/groups/create", [GroupController::class, "show_create_page"]);
            Route::get("/groups/{uuid}", [GroupController::class, "show_update_page"]);

            Route::get("/users", [UserController::class, "show_index_page"]);
            Route::get("/users/create", [GroupController::class, "show_create_page"]);
            Route::get("/users/{uuid}", [GroupController::class, "show_update_page"]);

            Route::get("/api-users", [ApiUserController::class, "show_index_page"]);
            Route::get("/api-users/create", [ApiUserController::class, "show_create_page"]);
            Route::get("/api-users/{uuid}", [ApiUserController::class, "show_update_page"]);
        });

        // ------------------------------------------- ACCOUNT - SETTINGS -- #
        Route::prefix("settings")->group(function() {
            Route::get("/account", [AccountController::class, "show_page"]);
        });
    });

    // ---------------------------------------------------------- MODULES -- #
    Route::prefix("modules")->group(function() {
        Route::get("/", [ModuleController::class, "index"]);
    });
});

// -------------------------------------------------------------- TESTING -- #
Route::prefix("~test")->group(function() {
    Route::get("/", function() { return ["type" => "web_no_auth"]; });

    Route::middleware("auth")->group(function() {
        Route::get("/protected", function() { return ["type" => "web_auth"]; });

        Route::middleware("root")->group(function() {
            Route::get("/root-access", function() { return ["type" => "root_access"]; });
        });
    });
});
