<?php

namespace Tests\Utils;

use Illuminate\Support\Str;

class Url {
    private $subdomain;
    private $domain;
    private $path;
    private $query;
    private $fragment;

    /**
     * Generate random subdomains.
     */
    function use_random_subdomains($nb_parts = 1) {
        $this->subdomain = $this->_generate_random_parts($nb_parts, ".");

        return $this;
    }

    /**
     * Append random slug to the given url.
     */
    function append_random_path($nb_parts = 1) {
        $this->path = $this->_generate_random_parts($nb_parts, "/");

        return $this;
    }

    function assemble() {
        $this->domain = config("app.domain");

        if (!$this->domain) throw new \Exception("A domain name is required");

        if ($this->subdomain) $this->subdomain = "{$this->subdomain}.";
        if ($this->path) $this->path = "/{$this->path}";
        if ($this->query) $this->query = "?{$this->query}";
        if ($this->fragment) $this->fragment = "#{$fragment}";

        return "{$this->subdomain}{$this->domain}{$this->path}{$this->query}{$this->fragment}";
    }

    /**
     * Generate random url parts.
     */
    private function _generate_random_parts($nb_parts, $join) {
        $parts = [];

        foreach (range(1, $nb_parts) as $_) {
            $parts[] = Str::lower(Str::random(mt_rand(3, 9)));
        }

        return join($join, $parts);
    }
}
