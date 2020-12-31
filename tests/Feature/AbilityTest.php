<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\{
    Ability,
    User,
};

class AbilityTest extends TestCase {
    use WithFaker, RefreshDatabase;
}
