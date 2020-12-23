<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy {
    use HandlesAuthorization;

    function user_list(User $user) {
        return $user->has_ability();
    }

    function user_create() {

    }

    function user_update() {

    }

    function user_delete() {

    }

    function user_delete_root() {

    }
}
