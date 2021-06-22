<?php

use App\Http\Controllers\WelcomeController;

Route::get("/", [WelcomeController::class, "show_index_page"]);
