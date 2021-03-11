<?php

namespace App\Http\Controllers\Components;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Kwerio\PaginatedTableDataProvider;
use App\Models\Components\Language;
use App\Http\Controllers\Traits;
use Illuminate\Support\Facades\DB;
use Kwerio\Normalizer;

class LanguageController extends Controller {
    use Traits\Abilities;

    private $rules = [
        "uuid" => "nullable",
        "locale" => "required",
        "module" => "required",
    ];

    /**
     * Get paginated list of available languages.
     *
     * @return array
     */
    function index(Request $request, PaginatedTableDataProvider $paginatedTableDataProvider) {
        $module = null;
        $query = Language::query();

        if ($request->filled("module")) {
            $module = $request->input("module");
            $query = Language::where("module", $module);
        }

        return $paginatedTableDataProvider
            ->authorize($this->prefix_abilities("language_index"))
            ->query($query)
            ->basic_filter(["name", "locale"])
            ->normalize([
                "uuid", "name", "locale",
                "default_at", "disabled_at", "created_at", "updated_at",
            ]);
    }

    /**
     * Add new language.
     *
     * @param Request $request
     * @return array
     */
    function create(Request $request) {
        $this->authorize($this->prefix_abilities("language_create")[0]);
        $data = $request->validate($this->rules);

        return $this->_upsert($data);
    }

    /**
     * Upsert a language.
     *
     * @param array $data
     * @return array
     */
    function _upsert(array $data) {
        try {
            DB::beginTransaction();

            // Filter language based on available languages in the locales.
            $language = array_filter(all_languages(true), function($language) use($data) {
                if ($data["locale"] === $language["locale"]) {
                    return true;
                }

                return false;
            });

            $normalizer = resolve(Normalizer::class);

            if (!count($language)) {
                return $normalizer->error("Locale {$data['locale']} does not exists", 404);
            } else {
                $language = array_values($language)[0];
            }

            // Create or Update the language.
            $language = Language::updateOrCreate([
                "locale" => $data["locale"],
                "module" => $data["module"],
            ], [
                "locale" => $language["locale"],
                "name" => $language["name"],
                "native_name" => $language["native_name"],
                "module" => $data["module"],
            ]);

            $language = $language->fresh();
            $language->log_user_action(empty($data["uuid"]) ? "create" : "update");

            // If there is no default language, then use current as default.
            if (Language::whereNotNull("default_at")->where("module", $data["module"])->count() === 0) {
                $language->default_at = now();
                $language->save();
            }

            DB::commit();

            return $normalizer
                ->message("Language '{$data['locale']}' upserted successfully")
                ->normalize($language, [$this, "_normalize_callback"]);
        }

        catch (\Throwable $e) {
            DB::rollback();
            throw $e;
        }
    }

    /**
     * Fetch languages metadata.
     *
     * @return arrya
     */
    function metadata(Request $request, Normalizer $normalizer) {
        $module = $request->get("module");

        if ($request->has("only_models") && $request->get("only_models") === true) {
            $languages = Language::whereNull("disabled_at")
                ->where("module", $module)
                ->orderByDesc("default_at")
                ->get();

            return $normalizer->normalize($languages, [$this, "_normalize_callback"]);
        }

        $locales = Language::whereNull("disabled_at")
            ->where("module", $module)
            ->orderByDesc("default_at")
            ->pluck("locale")
            ->toArray();

        $languages = array_map(function($language) use($locales) {
            return array_merge($language, [
                "disabled" => in_array($language["locale"], $locales)
            ]);
        }, all_languages(true));

        return [
            "languages" => array_values($languages),
        ];
    }

    /**
     * Normalize language data.
     *
     * @param Language $language
     * @return array
     */
    function _normalize_callback(Language $language) {
        return $language->only([
            "uuid", "locale", "name", "native_name", "default_at",
            "disabled_at", "created_at", "updated_at",
        ]);
    }
}
