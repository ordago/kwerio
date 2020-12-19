<?php

namespace App\Http\Controllers\Account;

use Illuminate\Support\Facades\Config;
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
        $modules = config("modules");

        $items = ModuleModel::get($this->columns)->map(function($item) use($modules) {
            $module = array_values(array_filter($modules, function($inner) use($item) {
                return $inner["uid"] === $item->uid;
            }))[0];

            return [
                "uid" => $item->uid,
                "name" => $module["name"],
                "created_at" => $item->created_at,
                "updated_at" => $item->updated_at,
            ];
        });

        return [
            "items" => $items,
            "total" => $total,
        ];
    }
}
