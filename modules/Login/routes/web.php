<?php declare(strict_types=1);

use Modules\Login\Http\Controllers\{
    Controller,
};

Route::get("/", [Controller::class, "index"]);
Route::post("/", [Controller::class, "attempt"]);
