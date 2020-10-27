<?php declare(strict_types=1);

namespace Modules\BasicAuthentication\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\BasicAuthentication\Module;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Modules\Home\Module as HomeModule;

class LoginController extends Controller {
    /**
     * Show signup page.
     *
     * @param Module $module
     * @return View
     */
    function index(Module $module) {
        return $module->view("login");
    }

    /**
     * Attempt to log user in.
     *
     * @param Request $request
     * @param Module  $module
     * @return Response
     */
    function attempt(Request $request, HomeModule $home_module) {
        $intended = $request->session()->pull("url.intended", $home_module->route_prefix());

        if (Auth::attempt($request->only("email", "password"))) {
            return $intended;
        }

        abort(404);
    }
}
