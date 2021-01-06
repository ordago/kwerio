<?php

namespace App\Http\Controllers\Account\Permissions;

use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Kwerio\Normalizer;

use App\Models\{
    Group as GroupModel,
    Module as ModuleModel,
    Ability as AbilityModel,
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
    function show_index_page() {
        $abilities = [
            "root/group_list",
            "root/group_create",
        ];

        if (!Gate::any($abilities)) {
            abort(403);
        }

        return view("account.permissions.groups");
    }

    /**
     * Show create page.
     *
     * @return View
     */
    function show_create_page() {
        $this->authorize("root/group_create");
        return view("account.permissions.groups");
    }

    /**
     * Show update page.
     *
     * @return view
     */
    function show_update_page() {
        $this->authorize("root/group_update");
        return view("account.permissions.groups");
    }

    /**
     * Get groups.
     *
     * @return array
     */
    function index(Request $request, Normalizer $normalizer) {
        $this->authorize("root/group_list");

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

        $items = $query->paginate(config("app.per_page"));

        return $normalizer->normalize($items, [$this, "_normalize_callback"]);
    }

    /**
     * Create new group.
     *
     * @param Request $request
     * @return array
     */
    function create(Request $request) {
        $this->authorize("root/group_create");

        $data = $request->validate([
            "name" => "required|unique:groups,name",
            "modules" => "",
            "abilities" => "",
        ]);

        return $this->_upsert($data);
    }

    /**
     * Update the given group.
     *
     * @param Request $request
     * @return array
     */
    function update(Request $request) {
        $this->authorize("root/group_update");

        $data = $request->validate([
            "uuid" => "required|exists:groups,uuid",
            "name" => [
                "required",
                Rule::unique("groups")->ignore($request->get("uuid"), "uuid"),
            ],
            "modules" => "",
            "abilities" => "",
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
            $normalizer = resolve(Normalizer::class);

            $group = GroupModel::updateOrCreate(["uuid" => @$data["uuid"]], [
                "slug" => Str::slug($data["name"]),
                "name" => $data["name"],
            ])->fresh();

            $modules = ModuleModel::whereIn("uuid", $data["modules"])->get(["id"]);
            $group->modules()->sync($modules);

            $abilities = [];

            foreach ($group->modules as $module) {
                foreach ($module->abilities as $ability) {
                    if (in_array($ability->uuid, $data["abilities"])) {
                        $abilities[] = $ability->id;
                    }
                }
            }

            $group->abilities()->sync($abilities);

            DB::commit();

            return $normalizer->normalize($group->fresh(), [$this, "_normalize_callback"]);
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
    function fetch_by_uuid(Request $request, Normalizer $normalizer) {
        $abilities = [
            "root/group_list",
            "root/group_update",
        ];

        if (!Gate::any($abilities)) {
            abort(403);
        }

        $data = $request->validate([
            "uuid" => "required|exists:groups,uuid",
        ]);

        $group = GroupModel::whereUuid($data["uuid"])->first();

        return $normalizer->normalize($group, [$this, "_normalize_callback"]);
    }

    /**
     * Get metadata.
     *
     * @return array
     */
    function metadata() {
        $metadata = [];
        $abilities = [
            "root/group_create",
            "root/group_update",
        ];

        if (Auth::user()->canAny($abilities)) {
            $metadata += [
                "groups" => GroupModel::all_normalized(),
                "modules" => ModuleModel::all_normalized(),
                "abilities" => AbilityModel::all_normalized(),
            ];
        }

        return $metadata;
    }

    /**
     * Normalize the groups.
     *
     * @param Collection $groups
     * @return array
     */
    function _normalize_callback(GroupModel $group) {
        $modules = $group->modules->pluck("uuid")->toArray();
        $abilities = $group->abilities()->pluck("uuid")->toArray();

        return array_merge(
            [
                "modules" => $modules,
                "abilities" => $abilities,
            ],
            $group->only($this->columns)
        );
    }
}
