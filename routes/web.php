<?php

use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\{
    MetadataController,
    LogoutController,
    ProfileController,
    LordLand\Admission\UserController,
    LordLand\Admission\ApiUserController,
    LordLand\Admission\GroupController,
};

$domain = config("app.domain");

Route::domain($domain)->group(function() {
    Route::get("/", [WelcomeController::class, "show_index_page"]);
});

Route::domain("{tenant}.{$domain}")->group(function() {
    Route::middleware(["auth"])->group(function() {
        Route::prefix("api")->group(function() {
            Route::get("/metadata", [MetadataController::class, "index"]);
        });

        Route::get("/logout", [LogoutController::class, "logout"]);
        Route::get("/profile", [ProfileController::class, "show_index_page"]);
    });

    Route::middleware(["auth", "root"])->group(function() {
        // ----------------------------------------------------- LORDLAND -- #
        Route::prefix("lordland")->group(function() {
            // ------------------------------------- LORDLAND / ADMISSION -- #
            Route::prefix("admission")->group(function() {
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
        });
    });
});
