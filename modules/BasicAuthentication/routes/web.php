<?php declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Modules\BasicAuthentication\Http\Controllers\{
    SignupController,
    LoginController,
};


Route::get("/signup", [SignupController::class, "index"]);
Route::post("/signup", [SignupController::class, "store"]);

Route::get("/login", [LoginController::class, "index"]);
Route::post("/login", [LoginController::class, "attempt"]);
