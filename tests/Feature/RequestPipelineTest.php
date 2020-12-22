<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Illuminate\Support\Str;
use App\Models\AccessToken;
use Illuminate\Support\Facades\Auth;

class RequestPipelineTest extends TestCase {
    use WithFaker, RefreshDatabase;

    /** @test */
    function from_web() {

    }
}
