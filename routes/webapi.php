<?php

use App\Http\Controllers\{
    MetadataController,
    LogoutController,
    ProfileController,
    Account\Permissions\UserController,
    Account\Permissions\ApiUserController,
    Account\Permissions\GroupController,
    Components\LanguageController,
    Components\FieldsetController,
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
});

Route::middleware(["auth:web,api"])->group(function() {
    // ------------------------------------------------------- COMPONENTS -- #
    Route::prefix("components")->group(function() {
        // ---------------------------------------------------- Languages -- #
        Route::post("/languages", [LanguageController::class, "index"]);
        Route::post("/languages/metadata", [LanguageController::class, "metadata"]);
        Route::post("/languages/create", [LanguageController::class, "create"]);
        Route::post("/languages/disable", [LanguageController::class, "disable"]);
        Route::post("/languages/enable", [LanguageController::class, "enable"]);
        Route::post("/languages/set-as-default", [LanguageController::class, "set_as_default"]);
        Route::delete("/languages", [LanguageController::class, "delete"]);

        // ---------------------------------------------------- Fieldsets -- #
        Route::post("/fieldsets", [FieldsetController::class, "index"]);
        Route::post("/fieldsets/metadata", [FieldsetController::class, "metadata"]);
        Route::post("/fieldsets/create", [FieldsetController::class, "create"]);
        Route::post("/fieldsets/disable", [FieldsetController::class, "disable"]);
        Route::post("/fieldsets/enable", [FieldsetController::class, "enable"]);
        Route::delete("/fieldsets", [FieldsetController::class, "delete"]);
    });
});
