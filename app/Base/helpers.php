<?php declare(strict_types=1);

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
        if (file_exists(public_path("hot"))) {
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
