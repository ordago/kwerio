<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ability;

class AbilityController extends Controller {
    /**
     * Get all available abilities.
     *
     * @return array
     */
    function all() {
        $abilities = Ability::get()->map(function($item) {
            return [
                "uuid" => $item->uuid,
                "name" => $item->name,
                "description" => $item->description,
                "created_at" => $item->created_at,
                "updated_at" => $item->updated_at,
            ];
        });

        return [
            "items" => $abilities,
            "total" => Ability::count(),
        ];
    }
}
