<?php

namespace App\Http\Controllers\Account\Permissions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\User as UserRepository;

class UserController extends Controller {
    /**
     * Show users page.
     *
     * @return View
     */
    function index() {
        return view("account.permissions.user");
    }

    /**
     * Get a list of paginated users.
     *
     * @param UserRepository $userRepo
     * @return array
     */
    function paginate(UserRepository $userRepo) {
        return $userRepo->index();
    }
}
