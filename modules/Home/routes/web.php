<?php declare(strict_types=1);

use Modules\Home\Http\Controllers\{
    Controller,
};

Route::get("/", [Controller::class, "index"]);
