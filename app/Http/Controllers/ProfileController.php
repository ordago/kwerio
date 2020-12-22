<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class ProfileController extends Controller {
    /**
     * Show profile index page.
     *
     * @return View
     */
    function show_index_page() {
        return view("profile.index");
    }
}
