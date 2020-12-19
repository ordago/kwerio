<?php declare(strict_types=1);

use Modules\About\Http\Controllers\{
    Controller,
};

Route::get("/", [Controller::class, "show_index_page"]);

Route::prefix("api")->group(function() {
    Route::get("/", [Controller::class, "index"]);
});
