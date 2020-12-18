<?php

namespace Modules\Login\Http\Controllers;

use App\Http\Controllers\Controller as BaseController;
use Modules\Login\Module;
use Modules\Home\Module as HomeModule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class Controller extends BaseController {
    /**
     * Show the login page.
     *
     * @return View
     */
    function index(Module $module) {
        return $module->view("index");
    }

    /**
     * Attempt to login.
     *
     * @return Response
     * @throws Exception
     */
    function attempt(Request $request, HomeModule $home_module) {
        $intended = $request->session()
            ->pull("url.intended", $home_module->route_prefix("/"));

        $credentials = $request->only("email", "password");

        if (Auth::guard("web")->attempt($credentials, $request->get("remember_me"))) {
            $request->session()->regenerate();

            return $intended;
        }

        abort(403);
    }
}
