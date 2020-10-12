<?php

namespace App\Http\Controllers\Account\Permissions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GroupController extends Controller {
    /**
     * Show groups page.
     *
     * @return View
     */
    function index() {
        return view("account.permissions.groups");
    }

    /**
     * Get a list of paginated groups.
     *
     * @return array
     */
    function paginate() {

    }
}
