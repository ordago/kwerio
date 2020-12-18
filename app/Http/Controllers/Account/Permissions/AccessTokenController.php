<?php

namespace App\Http\Controllers\Account\Permissions;

use App\Http\Controllers\Controller;

class AccessTokenController extends Controller {
    /**
     * Show access tokens page.
     *
     * @return View
     */
    function show_index_page() {
        return view("account.permissions.access-tokens");
    }
}
