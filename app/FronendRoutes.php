<?php declare(strict_types=1);

namespace App;

use Illuminate\Support\Fluent;

class FrontendRoutes extends Fluent {
    protected $attributes = [];

    function __construct() {
        $this->attributes = [
            [
                "resource" => [UserController::class, "show_page"],
                "groups" => ["Users Permission"],
            ]
        ];
    }
}
