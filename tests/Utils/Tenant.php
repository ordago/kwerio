<?php

namespace Tests\Utils;

use Illuminate\Support\Str;

class Tenant {
    /**
     * Generate random domain that does not exists.
     */
    function random_domain_404() {
        return resolve(Url::class)
            ->use_random_subdomains()
            ->assemble();
    }
}
