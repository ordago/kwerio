<?php

namespace App\Http\Controllers\Account\Permissions;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\{
    Group as GroupModel,
    Module as ModuleModel,
};

class GroupController extends Controller {
    private $columns = [
        "uuid",
        "name",
        "created_at",
        "updated_at",
    ];

    /**
     * Show groups page.
     *
     * @return View
     */
    function show_page() {
        return view("account.permissions.groups");
    }

    /**
     * Show create page.
     *
     * @return View
     */
    function show_create_page() {
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

        $paginator = $query->paginate(config("app.per_pagae"), $this->columns);

        return [
            "total" => $paginator->total(),
            "items" => $paginator->items(),
        ];
    }

    /**
     * Create new group.
     *
     * @param Request $request
     * @return string
     *   The uuid of the newly created group
     */
    function create(Request $request) {
        $data = $request->validate([
            "name" => "required|unique:groups,name",
            "modules" => "",
        ]);

        return $this->_upsert($data);
    }

    /**
     * Update the given group.
     *
     * @param Request $request
     * @return string
     */
    function update(Request $request) {
        $data = $request->validate([
            "uuid" => "required|exists:groups,uuid",
            "name" => [
                "required",
                Rule::unique("groups")->ignore($request->get("uuid"), "uuid"),
            ],
            "modules" => "",
        ]);

        return $this->_upsert($data);
    }

    /**
     * Update or Insert a new group.
     *
     * @param array $data
     * @return Group
     */
    private function _upsert(array $data) {
        DB::beginTransaction();

        try {
            $group = GroupModel::updateOrCreate(["uuid" => @$data["uuid"]], [
                "name" => $data["name"],
            ]);

            $modules = ModuleModel::whereIn("uid", $data["modules"])->get(["id"]);
            $group->modules()->sync($modules);

            $group = GroupModel::whereUuid($group->uuid)->get($this->columns);

            DB::commit();

            return $group;
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }
}
