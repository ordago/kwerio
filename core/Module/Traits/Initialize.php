<?php

namespace Kwerio\Module\Traits;

use Illuminate\Support\Facades\Auth;

trait Initialize {
    /**
     * Initialize module.
     */
    function init() {
        $this->_abort_if_not_authorized();
    }

    /**
     * Abort 403 if user is not authorized to use module.
     */
    function _abort_if_not_authorized() {
        if (!$this->auth) return;
        if (!Auth::check()) abort(403);

        $user = Auth::user();
        dd($user);
    }
}
