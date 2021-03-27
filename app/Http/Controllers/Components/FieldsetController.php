<?php

namespace App\Http\Controllers\Components;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Kwerio\PaginatedTableDataProvider;
use App\Models\Components\Fieldset;
use App\Http\Controllers\Traits;
use Illuminate\Support\Facades\DB;
use Kwerio\Normalizer;

class FieldsetController extends Controller {
    use Traits\Abilities;

    private $rules = [
        "uuid" => "nullable",
        "locale" => "required",
        "module" => "nullable",
    ];

    /**
     * Get paginated list of available fieldsets.
     *
     * @return array
     */
    function index(Request $request, PaginatedTableDataProvider $paginatedTableDataProvider) {
        $module = null;
        $query = Fieldset::query();

        if ($request->filled("module")) {
            $module = $request->input("module");
            $query = Fieldset::where("module", $module);
        }

        return $paginatedTableDataProvider
            ->authorize($this->prefix_abilities("fieldset_index"))
            ->query($query)
            ->basic_filter(["name", "locale"])
            ->normalize([
                "uuid", "name", "locale", "description",
                "disabled_at", "created_at", "updated_at",
            ]);

    }

    /**
     * Add new fieldset.
     *
     * @param Request $request
     * @return array
     */
    function create(Request $request) {
        $this->authorize($this->prefix_abilities("fieldset_create")[0]);
        $data = $request->validate($this->rules);

        return $this->_upsert($data);
    }

    /**
     * Upsert a fieldset.
     *
     * @param array $data
     * @return array
     */
    function _upsert(array $data) {
        try {
            DB::beginTransaction();

            // Filter fieldset based on available fieldsets in the locales.
            $fieldset = array_filter(all_fieldsets(true), function($fieldset) use($data) {
                if ($data["locale"] === $fieldset["locale"]) {
                    return true;
                }

                return false;
            });

            $normalizer = resolve(Normalizer::class);

            if (!count($fieldset)) {
                return $normalizer->error("Locale {$data['locale']} does not exists", 404);
            } else {
                $fieldset = array_values($fieldset)[0];
            }

            // Create or Update the fieldset.
            $fieldset = Fieldset::updateOrCreate([
                "locale" => $data["locale"],
                "module" => $data["module"],
            ], [
                "locale" => $fieldset["locale"],
                "name" => $fieldset["name"],
                "native_name" => $fieldset["native_name"],
                "module" => $data["module"],
            ]);

            $fieldset = $fieldset->fresh();
            $fieldset->log_user_action("upsert");

            // If there is no default fieldset, then use current as default.
            if (Fieldset::whereNotNull("default_at")->where("module", $data["module"])->count() === 0) {
                $fieldset->default_at = now();
                $fieldset->save();
            }

            DB::commit();

            return $normalizer
                ->message("Fieldset '{$data['locale']}' upserted successfully")
                ->normalize($fieldset, [$this, "_normalize_callback"]);
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Fetch fieldsets metadata.
     *
     * @return arrya
     */
    function metadata(Request $request, Normalizer $normalizer) {
        $this->authorize($this->prefix_abilities("fieldset_create")[0]);

        $module = $request->get("module");

        if ($request->has("only_models") && $request->get("only_models") === true) {
            $fieldsets = Fieldset::whereNull("disabled_at")
                ->where("module", $module)
                ->orderByDesc("default_at")
                ->get();

            return $normalizer->normalize($fieldsets, [$this, "_normalize_callback"]);
        }

        $locales = Fieldset::whereNull("disabled_at")
            ->where("module", $module)
            ->orderByDesc("default_at")
            ->pluck("locale")
            ->toArray();

        $fieldsets = array_map(function($fieldset) use($locales) {
            return array_merge($fieldset, [
                "disabled" => in_array($fieldset["locale"], $locales)
            ]);
        }, all_fieldsets(true));

        return [
            "fieldsets" => array_values($fieldsets),
        ];
    }

    /**
     * Delete the given fieldsets by uuids.
     *
     * @return array
     */
    function delete(Request $request, Normalizer $normalizer) {
        $this->authorize($this->prefix_abilities("fieldset_delete")[0]);

        try {
            DB::beginTransaction();

            $data = $request->validate([
                "uuids" => "required",
                "module" => "required",
            ]);

            $items = Fieldset::whereIn("uuid", $data["uuids"])
                ->where("module", $data["module"])
                ->get();

            $items->each(function($item) {
                $item->log_user_action("delete", $item->toArray());
            });

            Fieldset::whereIn("uuid", $data["uuids"])
                ->where("module", $data["module"])
                ->delete();

            DB::commit();

            return $normalizer
                ->message("Fieldsets deleted successfully")
                ->normalize($items, [$this, "_normalize_callback"]);
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Set fieldset as defautl.
     *
     * @return array
     */
    function set_as_default(Request $request, Normalizer $normalizer) {
        $this->authorize($this->prefix_abilities("fieldset_set_as_default")[0]);

        $data = $request->validate([
            "uuid" => "required",
            "module" => "required",
        ]);

        try {
            DB::beginTransaction();

            $fieldset = Fieldset::where("uuid", $data["uuid"])
                ->where("module", $data["module"])
                ->first();

            Fieldset::where("module", $data["module"])
                ->update(["default_at" => null]);

            $fieldset->default_at = now();
            $fieldset->save();

            $fieldset->log_user_action("set_as_default");

            DB::commit();

            return $normalizer
                ->message("Fieldset '{$fieldset->name}' has being set as default")
                ->normalize($fieldset, [$this, "_normalize_callback"]);
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Disable the given fieldsets.
     *
     * @return array
     */
    function disable(Request $request, Normalizer $normalizer) {
        $this->authorize($this->prefix_abilities("fieldset_disable")[0]);

        $data = $request->validate([
            "uuids" => "required",
            "module" => "nullable",
        ]);

        try {
            DB::beginTransaction();

            Fieldset::where("module", $data["module"])
                ->whereIn("uuid", $data["uuids"])
                ->update(["disabled_at" => now()]);

            $fieldsets = Fieldset::where("module", $data["module"])
                ->whereIn("uuid", $data["uuids"])
                ->get();

            $fieldsets->each(function($fieldset) {
                $fieldset->log_user_action("disable");
            });

            DB::commit();

            return $normalizer
                ->message($fieldsets->count() . " are disabled successfully")
                ->normalize($fieldsets, [$this, "_normalize_callback"]);
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Enable the given fieldsets.
     *
     * @return array
     */
    function enable(Request $request, Normalizer $normalizer) {
        $this->authorize($this->prefix_abilities("fieldset_enable")[0]);

        $data = $request->validate([
            "uuids" => "required",
            "module" => "nullable",
        ]);

        try {
            DB::beginTransaction();

            Fieldset::where("module", $data["module"])
                ->whereIn("uuid", $data["uuids"])
                ->update(["disabled_at" => null]);

            $fieldsets = Fieldset::where("module", $data["module"])
                ->whereIn("uuid", $data["uuids"])
                ->get();

            $fieldsets->each(function($fieldset) {
                $fieldset->log_user_action("enable");
            });

            DB::commit();

            return $normalizer
                ->message($fieldsets->count() . " fieldsets are enabled")
                ->normalize($fieldsets, [$this, "_normalize_callback"]);
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Normalize fieldset data.
     *
     * @param Fieldset $fieldset
     * @return array
     */
    function _normalize_callback(Fieldset $fieldset) {
        return $fieldset->only([
            "uuid", "locale", "name", "native_name", "default_at",
            "disabled_at", "created_at", "updated_at",
        ]);
    }
}
