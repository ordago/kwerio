<?php

namespace App\Http\Controllers\Account\Permissions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Group as GroupRepository;

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
     * Get page metadata.
     *
     * @return array
     */
    function metadata() {

    }

    /**
     * Get a list of paginated groups.
     *
     * @return array
     */
    function paginate(GroupRepository $groupRepo) {
        return $groupRepo->index();
    }
}
