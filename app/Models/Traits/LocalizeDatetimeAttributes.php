<?php

namespace App\Models\Traits;

use App\Models\ApiUser;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

trait LocalizeDatetimeAttributes {
    // owner_at
    function getOwnerAt($owner_at) { return localize_date($created_at); }

    // created_at
    function getCreatedAtAttribute($created_at) { return localize_date($created_at); }

    // updated_at
    function getUpdatedAtAttribute($updated_at) { return localize_date($updated_at); }

    // deleted_at
    function getDeletedAtAttribute($deleted_at) { return localize_date($deleted_at); }
}
