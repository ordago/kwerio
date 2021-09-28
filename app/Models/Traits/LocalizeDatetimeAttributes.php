<?php

namespace App\Models\Traits;

use App\Models\ApiUser;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

trait LocalizeDatetimeAttributes {
    // owner_at
    function getOwnerAtAttribute($owner_at) { return localize_date($owner_at); }

    // created_at
    function getCreatedAtAttribute($created_at) { return localize_date($created_at); }

    // updated_at
    function getUpdatedAtAttribute($updated_at) { return localize_date($updated_at); }

    // deleted_at
    function getDeletedAtAttribute($deleted_at) { return localize_date($deleted_at); }

    // disabled_at
    function getDisabledAtAttribute($disabled_at) { return localize_date($disabled_at); }
}
