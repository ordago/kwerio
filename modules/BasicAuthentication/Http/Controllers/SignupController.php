<?php declare(strict_types=1);

namespace Modules\BasicAuthentication\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\BasicAuthentication\Module;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class SignupController extends Controller {
    /**
     * Show signup page.
     *
     * @param Module $module
     * @return View
     */
    function index(Module $module) {
        return $module->view("signup");
    }

    /**
     * Create new user.
     *
     * @param Request $request
     * @return integer
     * @throws Exception
     */
    function store(Request $request) {
        $data = $request->validate([
            "email" => "required|unique:users,email",
            "password" => "required|confirmed",
        ]);

        $user = User::create([
            "email" => $data["email"],
            "password" => Hash::make($data["password"]),
            "owner_at" => User::count() === 0 ? now() : null,
        ]);

        Auth::login($user);

        return response(null, 201);
    }
}
