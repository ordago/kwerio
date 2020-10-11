<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ModuleController extends Controller {
    /**
     * Show modules page.
     *
     * @return View
     */
    function index() {
        return view("account.modules");
    }

    /**
     * Get a list of paginated modules.
     *
     * @param ModuleRepository $moduleRepo
     * @return array
     */
    function paginate(ModuleRepository $moduleRepo) {
        return $moduleRepo->index();
    }
}
