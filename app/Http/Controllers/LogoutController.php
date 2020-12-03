<?php declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Modules\Login\Module;

class LogoutController extends Controller {
    /**
     * Log user out.
     *
     * @param Module $module
     * @return Redirect
     */
    function logout(Module $module) {
        Auth::logout();

        return redirect()->to($module->route_prefix());
    }
}
