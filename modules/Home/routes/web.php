<?php

use Modules\Home\Http\Controllers\{
    Controller,
};

Route::get("/", [Controller::class, "index"]);
