<?php declare(strict_types=1);

use Modules\About\Http\Controllers\{
    Controller,
};

Route::get("/", [Controller::class, "index"]);
