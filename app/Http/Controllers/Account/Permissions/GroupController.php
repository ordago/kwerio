<?php

namespace App\Http\Controllers\Account\Permissions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\{
    Group as GroupModel,
};

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
    function show_page() {
        return view("account.permissions.groups");
    }

    /**
     * Get groups.
     *
     * @return array
     */
    function index(Request $request) {
        $data = $request->validate([
            "page" => "required|numeric",
            "sorts" => "required|array",
            "q" => "",
        ]);

        $query = GroupModel::query();

        if (!empty($data["q"])) {
            $query->where("name", "like", "%{$data['q']}%");
        }

        foreach ($data["sorts"] as $sort) {
            $query->orderBy($sort["name"], $sort["dir"]);
        }

        $paginator = $query->paginate(config("app.per_pagae"), [
            "uuid", "name", "created_at", "updated_at",
        ]);

        return [
            "total" => $paginator->total(),
            "items" => $paginator->items(),
        ];
    }
}
