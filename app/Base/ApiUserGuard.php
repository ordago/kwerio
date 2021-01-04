<?php

namespace Kwerio;

use App\Models\ApiUser;
use Illuminate\Support\Str;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Http\Request;
use Illuminate\Contracts\Auth\{
    Guard,
    Authenticatable,
};

class ApiUserGuard implements Guard {
    private $request;

    /**
     * Initialize Constructor.
     *
     * @param Request $request
     */
    function __construct(Request $request) {
        $this->request = $request;
    }

    /**
     * Determine if the current user is authenticated.
     *
     * @return bool
     */
    public function check() {
        if (is_null($apiUser = $this->user())) return false;

        // Valdiate hashed token
        if ($apiUser->is_hashed) {
            $token = substr($this->request->bearerToken(), strlen($apiUser->uuid) + 2);
            $equals = hash("sha256", $token) === $apiUser->token;

            if (!$equals) return false;
        }

        // Extra validation

        return true;
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
        $token = $this->request->bearerToken();
        $uuid = strstr($token, "::", true);

        if ($uuid) {
            return ApiUser::whereUuid($uuid)->first();
        }

        return ApiUser::whereToken($token)->first();
    }

    /**
     * Get the ID for the currently authenticated user.
     *
     * @return int|string|null
     */
    public function id() {
        return $this->user()->id;
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
