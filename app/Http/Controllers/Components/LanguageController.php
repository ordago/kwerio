<?php

namespace App\Http\Controllers\Components;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Kwerio\PaginatedTableDataProvider;
use App\Models\Components\Language;
use App\Http\Controllers\Traits;

class LanguageController extends Controller {
    use Traits\Abilities;

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
                "disabled_at", "created_at", "updated_at",
            ]);
    }
}
