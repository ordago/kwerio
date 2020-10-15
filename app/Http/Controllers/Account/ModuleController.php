<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{
    Module as ModuleModel,
};

class ModuleController extends Controller {
    /**
     * List of columns to return with every request.
     */
    private $columns = [
        "uid",
        "name",
        "slug",
        "icon",
        "position",
        "hidden",
        "created_at",
        "updated_at",
    ];

    /**
     * Show modules page.
     *
     * @return View
     */
    function index() {
        return view("account.modules");
    }

    /**
     * Fetch all modules.
     *
     * @return array
     */
    function all() {
        $total = ModuleModel::count();

        $items = ModuleModel::get($this->columns);

        return [
            "items" => $items,
            "total" => $total,
        ];
    }
}
