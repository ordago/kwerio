<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Str;

class ModuleCorsTest extends TestCase {
    use WithFaker, RefreshDatabase;

    private $api = "/_/test/api/cors";

    /** @test */
    function has_proper_cors_header_in_response() {

    }
}
