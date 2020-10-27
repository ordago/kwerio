<?php declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class ProfileController extends Controller {
    function show_page() {
        return view("profile.index");
    }
}
