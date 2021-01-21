<?php

namespace Kwerio\Metadata;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

trait InteractsWithTranslations {
    /**
     * Get translations.
     *
     * @return self
     */
    function translations() {
        $module = config("module");
        $user = Auth::user();
        $this->attributes["translations"] = [];

        if (!($user instanceof User)) {
            return $this;
        }

        if ($module) {
            $path = public_path("i18n/{$module}", $user->locale);
            $this->locate($path, $user->locale);
        } else {
            $path = public_path("i18n/core", $user->locale);
            $this->locate($path, $user->locale);
        }

        return $this;
    }

    /**
     * Set translations for the given locale (cascade down).
     *
     * @param string $path
     * @param string $locale
     * @return array
     */
    private function locate($path, $locale) {
        if (file_exists("{$path}/{$locale}.json")) {
            $this->attributes["translations"] = json_decode(file_get_contents("{$path}/{$locale}.json"), true);
        } else {
            preg_match("/(\w+)_/", $locale, $m);

            if (isset($m[1]) && file_exists("{$path}/{$m[1]}.json")) {
                $this->attributes["translations"] = json_decode(file_get_contents("{$path}/{$m[1]}.json"), true);
            }
        }
    }
}
