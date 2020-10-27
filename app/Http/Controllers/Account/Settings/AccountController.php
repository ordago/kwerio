<?php declare(strict_types=1);

namespace App\Http\Controllers\Account\Settings;

use App\Http\Controllers\Controller;

class AccountController extends Controller {
    /**
     * Show account page.
     *
     * @return View
     */
    function show_page() {
        return view("account.settings.account");
    }
}
