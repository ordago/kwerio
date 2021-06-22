<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WelcomeController extends Controller {
    /**
     * Show welcome page.
     */
    function show_index_page() {
        return view("pages.welcome.index");
    }
}
