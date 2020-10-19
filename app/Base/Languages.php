<?php declare(strict_types=1);

namespace App\Base;

use Illuminate\Support\Facades\Cache;
use ResourceBundle;
use Locale;

class Languages {
    /**
     * Get a list of all languages and there locale.
     *
     * @return array
     */
    function all() {
        $locales = collect(ResourceBundle::getLocales(""))->map(function($locale) {
            return [
                "locale" => $locale,
                "name" => Locale::getDisplayName($locale, "en"),
                "native_name" => Locale::getDisplayName($locale, $locale),
            ];
        });

        return $locales;
    }
}
