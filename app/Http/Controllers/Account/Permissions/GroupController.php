<?php

namespace App\Http\Controllers\Account\Permissions;

use Illuminate\Validation\Rule;
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
     * Show update page.
     *
     * @return view
     */
    function show_update_page() {
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

        $results = $query->paginate(config("app.per_page"));

        return $this->_normalize($results);
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
            ])->fresh();

            $modules = ModuleModel::whereIn("uid", $data["modules"])->get(["id"]);
            $group->modules()->sync($modules);

            DB::commit();

            return $this->_normalize(GroupModel::whereUuid($group->uuid)->get());
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Fetch a group by uuid.
     *
     * @return Group
     */
    function fetch_by_uuid(Request $request) {
        $data = $request->validate([
            "uuid" => "required|exists:groups,uuid",
        ]);

        $groups = GroupModel::whereUuid($data["uuid"])->get();

        return $this->_normalize($groups);
    }

    /**
     * Fetch all groups.
     *
     * @return array
     */
    function all() {
        return $this->_normalize(GroupModel::get());
    }

    /**
     * Normalize the groups.
     *
     * @param Collection $groups
     * @return array
     */
    function _normalize($groups) {
        $items = $groups->map(function($group) {
            $modules = $group->modules->pluck("uid")->toArray();

            return array_merge(
                ["modules" => $modules],
                $group->only($this->columns)
            );
        });

        $total = GroupModel::count();
        $page = request()->get("page");

        return [
            "items" => $items,
            "total" => $total,
            "next_page" => $total === config("app.per_page") ? $page + 1 : $page,
        ];
    }
}
