<?php

namespace App\Http\Controllers\Account\Permissions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\{
    Group as GroupRepository,
    Module as ModuleRepository,
};

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
     * Show page to create new group.
     *
     * @return View
     */
    function create() {
        return view("account.permissions.groups");
    }

    /**
     * Create a new group.
     *
     * @param Request $request
     */
    function store(Request $request) {
        $data = $request->validate([
            "uuid" => "",
            "name" => "required|unique:groups,name",
            "modules" => "",
        ]);

        dd($data);
    }

    function update() {

    }

    /**
     * Get page metadata.
     *
     * @return array
     */
    function metadata(ModuleRepository $moduleRepo) {
        $modules = $moduleRepo->all()->map(function($module) {
            return [
                "uid" => $module->uid,
                "name" => $module->name,
            ];
        })
            ->filter(function($module) {
                return file_exists(base_path("modules/{$module["uid"]}"));
            });

        return [
            "modules" => $modules,
        ];
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
