<?php

namespace App\Http\Controllers\Account\Permissions;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Kwerio\Normalizer;
use Kwerio\PaginatedTableDataProvider;

use App\Models\{
    Ability,
    Group,
    Module,
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
            "root/group_index",
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
    function index(PaginatedTableDataProvider $paginatedTableDataProvider) {
        return $paginatedTableDataProvider
            ->authorize("root/group_index")
            ->query(Group::where("slug", "<>", "root"))
            ->basic_filter("name")
            ->normalize(function($group) {
                return $this->_normalize_callback($group);
            });
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
            "modules" => "nullable|array",
            "abilities" => "nullable|array",
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
            "modules" => "nullable|array",
            "abilities" => "nullable|array",
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
        try {
            DB::beginTransaction();

            $normalizer = resolve(Normalizer::class);

            if ($data["name"] === "root") {
                return $normalizer
                    ->error("ROOT group upsert is not allowed", 403);
            }

            $data["modules"] = empty($data["modules"]) ? [] : $data["modules"];
            $data["abilities"] = empty($data["abilities"]) ? [] : $data["abilities"];

            $group = Group::updateOrCreate(["uuid" => @$data["uuid"]], [
                "slug" => Str::slug($data["name"]),
                "name" => $data["name"],
            ])->fresh();

            $modules = Module::whereIn("uuid", $data["modules"])->get(["id"]);
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

            return $normalizer
                ->message("Group '{$group->name}' upserted successfully")
                ->normalize($group->fresh(), [$this, "_normalize_callback"]);
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
            "root/group_index",
            "root/group_update",
        ];

        if (!Gate::any($abilities)) {
            abort(403);
        }

        $data = $request->validate([
            "uuid" => "required|exists:groups,uuid",
        ]);

        $group = Group::whereUuid($data["uuid"])->first();

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
                "groups" => Group::all_normalized(),
                "modules" => Module::all_normalized(),
                "abilities" => Ability::all_normalized(),
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
    function _normalize_callback(Group $group) {
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
