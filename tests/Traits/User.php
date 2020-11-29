<?php

namespace Tests\Traits;

use App\Models\User as UserModel;

trait User {
    function get_user_owner() {
        return UserModel::factory()->create([
            "owner_at" => now(),
        ])
            ->fresh();
    }
}
