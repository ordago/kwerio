<?php declare(strict_types=1);

namespace App\Base;

use Illuminate\Support\Facades\Cache;
use Carbon\Language;

class Languages {
    /**
     * Get a list of supported languages.
     *
     * @return array
     */
    function all() {
        if ($languages = Cache::get("languages")) {
            return $languages;
        }

        $languages = collect(Language::all())->map(function($item, $key) {
            return [
                "locale" => $key,
                "iso_name" => $item["isoName"],
                "native_name" => $item["nativeName"],
            ];
        })
            ->values();

        Cache::put("languages", $languages);

        return $languages;
    }

    /**
     * Check if the given locale exists in the list of supported languages.
     *
     * @param string $locale
     * @return bool
     */
    function locale_exists(string $locale) {
        return $this->all()->first(function($item) use($locale) {
            if ($item["locale"] === $locale) return true;
            return false;
        });
    }
}
