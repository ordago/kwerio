<?php

namespace Kwerio;

use Illuminate\Contracts\Auth\{
    Guard,
    Authenticatable,
};

class ApiUserGuard implements Guard {
    /**
     * Determine if the current user is authenticated.
     *
     * @return bool
     */
    public function check() {
        dd("g:check");
    }

    /**
     * Determine if the current user is a guest.
     *
     * @return bool
     */
    public function guest() {
        dd("g:guest");
    }

    /**
     * Get the currently authenticated user.
     *
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function user() {
        return \App\Models\User::first();
    }

    /**
     * Get the ID for the currently authenticated user.
     *
     * @return int|string|null
     */
    public function id() {
        dd("g:id");
    }

    /**
     * Validate a user's credentials.
     *
     * @param  array  $credentials
     * @return bool
     */
    public function validate(array $credentials = []) {
        dd("g:validate");
    }

    /**
     * Set the current user.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @return void
     */
    public function setUser(Authenticatable $user) {
        dd("g:setUser");
    }
}
