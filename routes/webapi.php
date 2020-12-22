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
    Route::prefix("api")->group(function() {
        Route::get("/metadata", [MetadataController::class, "index"]);
    });
});

Route::middleware(["auth", "owner-only"])->group(function() {
    // ---------------------------------------------------------- ACCOUNT -- #
    Route::prefix("account")->group(function() {
        // ---------------------------------------- ACCOUNT / PERMISSIONS -- #
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

    // ---------------------------------------------------------- MODULES -- #
    Route::prefix("modules")->group(function() {
        Route::post("/", [ModuleController::class, "paginate"]);
        Route::post("/all", [ModuleController::class, "all"]);
    });
});

// -------------------------------------------------------------- TESTING -- #
Route::prefix("~test/api")->group(function() {
    Route::get("/", function() { return ["type" => "webapi_no_auth"]; });

    Route::middleware("auth")->group(function() {
        Route::get("/protected", function() { return ["type" => "webapi_auth"]; });
    });
});
