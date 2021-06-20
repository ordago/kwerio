<?php

namespace Kwerio;

use Illuminate\Auth\TokenGuard as BaseTokenGuard;
use App\Models\ApiUser;

class TokenGuard extends BaseTokenGuard {
    /**
     * {@inheritdoc}
     */
    public function user() {
        if ($this->user) {
            return $this->user;
        }

        if (!empty($token = $this->getTokenForRequest())) {
            if ($uuid = strstr($token, "::", true)) {
                if ($user = ApiUser::whereUuid($uuid)->first()) {
                    $token = substr($token, strlen($user->uuid) + 2);

                    if (hash("sha256", $token) === $user->token) {
                        return $this->user = $user;
                    }
                }
            }

            return $this->user = ApiUser::whereToken($token)->first();
        }

        return $this->user = null;
    }
}
