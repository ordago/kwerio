<?php

namespace App\Models\Traits;

use App\Models\ApiUser;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

trait LocalizeDatetimeAttributes {
    // owner_at
    function getOwnerAt($owner_at) { return $this->_localize($created_at); }

    // created_at
    function getCreatedAtAttribute($created_at) { return $this->_localize($created_at); }

    // updated_at
    function getUpdatedAtAttribute($updated_at) { return $this->_localize($updated_at); }

    // deleted_at
    function getDeletedAtAttribute($deleted_at) { return $this->_localize($deleted_at); }

    /**
     * Localize the datetime attribute.
     *
     * @param string|Carbon $value
     * @return Carbon
     */
    private function _localize($value) {
        $user = Auth::user();

        if (get_class($user) === ApiUser::class) {
            return (new Carbon($value));
        }

        return (new Carbon($value))
            ->timezone($user->timezone)
            ->locale($user->locale)
            ->isoFormat($user->locale_iso_format);
    }
}
