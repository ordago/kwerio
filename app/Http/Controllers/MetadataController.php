<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Kwerio\Metadata\Metadata;

class MetadataController extends Controller {
    /**
     * Get the metadata required to render dashboard.
     *
     * @return array
     */
    function index(Metadata $metadata) {
        return $metadata
            ->user()
            ->menu()
            ->translations();
    }
}
