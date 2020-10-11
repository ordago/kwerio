<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Base\Module\Maker;
use Illuminate\Support\Facades\Artisan;

class ModuleSyncCommandTest extends TestCase {
    use RefreshDatabase;

    /** @test */
    function can_run_sync_command() {
        try {
            Artisan::call("module:sync");
            $this->assertTrue(true);
        } catch (\Throwable $e) {
            throw $e;
        }
    }
}
