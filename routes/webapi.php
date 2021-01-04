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

Route::middleware(["auth:web,api", "root"])->group(function() {
    // ---------------------------------------------------------- ACCOUNT -- #
    Route::prefix("account")->group(function() {
        // ---------------------------------------- ACCOUNT / PERMISSIONS -- #
        Route::prefix("permissions")->group(function() {
            Route::post("/groups", [GroupController::class, "index"]);
            Route::post("/groups/create", [GroupController::class, "create"]);
            Route::post("/groups/update", [GroupController::class, "update"]);
            Route::post("/groups/fetch-by-uuid", [GroupController::class, "fetch_by_uuid"]);
            Route::post("/groups/metadata", [GroupController::class, "metadata"]);

            Route::post("/users", [UserController::class, "index"]);
            Route::post("/users/create", [UserController::class, "create"]);
            Route::post("/users/update", [UserController::class, "update"]);
            Route::post("/users/fetch-by-uuid", [UserController::class, "fetch_by_uuid"]);
            Route::post("/users/metadata", [UserController::class, "metadata"]);

            Route::post("/api-users", [ApiUserController::class, "index"]);
            Route::post("/api-users/create", [ApiUserController::class, "create"]);
            Route::post("/api-users/update", [ApiUserController::class, "update"]);
            Route::post("/api-users/fetch-by-uuid", [ApiUserController::class, "fetch_by_uuid"]);
            Route::post("/api-users/metadata", [ApiUserController::class, "metadata"]);
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
