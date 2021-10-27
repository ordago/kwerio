<?php

use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use App\Models\ApiUser;
use Kwerio\Normalizer;

if (!function_exists("response_success")) {
    function response_success($msg) {
        return resolve(Normalizer::class)->success($msg);
    }
}

if (!function_exists("response_warning")) {
    function response_warning($msg) {
        return resolve(Normalizer::class)->warning($msg);
    }
}

if (!function_exists("response_error")) {
    function response_error($msg) {
        return resolve(Normalizer::class)->error($msg);
    }
}

if (function_exists("response_info")) {
    function response_info($msg) {
        return resolve(Normalizer::class)->info($msg);
    }
}

if (!function_exists("name_to_duplicate")) {
    /**
     * Duplicate the given name.
     *
     * @param string $name
     * @return string
     */
    function name_to_duplicate($name) {
        if (empty($name)) {
            $name = "";
        }

        preg_match("/(.+)(?: \((\d+)\))$/", $name, $m);
        $name = isset($m[1]) ? $m[1] : $name;

        return $name;
    }
}

if (!function_exists("get_token_for_request")) {
    /**
     * Get the token for the current request.
     *
     * @param Request|null $request
     * @return string|null
     */
    function get_token_for_request($request = null) {
        if (!$request) $request = request();

        $token = $request->query("token");

        if (empty($token)) $token = $request->input("token");
        if (empty($token)) $token = $request->input("api_token");
        if (empty($token)) $token = $request->bearerToken();
        if (empty($token)) $token = $request->getPassword();

        return $token;
    }
}

if (!function_exists("localize_date")) {
    /**
     * Localize date based on user preferences.
     *
     * @param string|Carbon $value
     * @return Carbon
     */
    function localize_date($value) {
        if (empty($value)) {
            return $value;
        }

        $user = request()->user();

        if (is_null($user) || get_class($user) === ApiUser::class) {
            return (new Carbon($value));
        }

        return (new Carbon($value))
            ->timezone($user->timezone)
            ->locale($user->locale)
            ->isoFormat($user->locale_iso_format);
    }
}

if (!function_exists("get_locale_iso_formats")) {
    /**
     * Get a list of supported locale iso formats.
     *
     * @return array
     */
    function get_locale_iso_formats() {
        $iso_formats = resolve(Carbon::class)->getIsoFormats();
        $locale_iso_formats = [];

        foreach ($iso_formats as $key => $value) {
            $locale_iso_formats[] = [
                "label" => $key,
                "example" => now()->isoFormat($key),
            ];
        }

        return $locale_iso_formats;
    }
}

if (!function_exists("all_languages")) {
    /**
     * Get a list of all languages and there locale.
     *
     * @return array
     */
    function all_languages($to_array = false) {
        $locales = collect(ResourceBundle::getLocales(""))->map(function($locale) {
            return [
                "locale" => $locale,
                "name" => Locale::getDisplayName($locale, "en"),
                "native_name" => Locale::getDisplayName($locale, $locale),
            ];
        });

        if ($to_array) {
            return $locales->toArray();
        }

        return $locales;
    }
}

if (!function_exists("rsc")) {
    /**
     * A replace for mix() function that resolves assets based on the environment.
     *
     * @param string $asset
     */
    function rsc(string $asset) {
        // If we are in production, then we simply return mix().
        if (app()->environment() === "production") {
            return mix($asset);
        }

        // Check if hmr is enabled.
        if (is_file(public_path("hot"))) {
            $hot = parse_url(file_get_contents(public_path("hot")));

            if (isset($hot["port"]) && isset($hot["host"])) {
                $fp = @fsockopen($hot["host"], $hot["port"]);

                if (is_resource($fp)) {
                    return "/" . ltrim($asset, "/");
                }
            }
        }

        return mix($asset);
    }
}

if (!function_exists("is_rtl")) {
    /**
     * Check if the given locale is rtl or not.
     *
     * @param string $locale
     * @return bool
     * @throws Exception
     */
    function is_rtl(string $locale) {
        $rtl_languages = [
            "ar", "dv", "he", "ks", "ku", "pa", "fa", "ps", "sd", "tk", "ug", "ur", "yi",
            "ara", "arc", "bal", "div", "fas", "heb", "ira", "jpr", "jrb", "kas",
            "kur", "man", "men", "nqo", "ota", "pal", "pan", "peo", "per", "pus",
            "sam", "snd", "syc", "syr", "tmh", "tuk", "uig", "urd", "yid",
        ];

        preg_match("/(^[[:alpha:]]+)/", $locale, $m);

        if (!isset($m[1])) throw new \Exception("Invalid locale {$locale}");

        return in_array(strtolower($m[1]), $rtl_languages);
    }
}
