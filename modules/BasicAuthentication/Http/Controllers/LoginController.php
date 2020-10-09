<?php declare(strict_types=1);

namespace Modules\BasicAuthentication\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\BasicAuthentication\Module;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

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
    function attempt(Request $request, Module $module) {
        if (Auth::attempt($request->only("email", "password"))) {
            return response(null, 200);
        }

        abort(404);
    }
}
