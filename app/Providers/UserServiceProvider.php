<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Kwerio\UserService\Upsert\AUser as UserUpsert;
use Kwerio\UserService\Upsert\Web as UserWeb;
use Kwerio\UserService\Upsert\Token as UserToken;

class UserServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        $this->app->bind(UserUpsert::class, function($app) {
            $request = resolve(Request::class);

            switch ($type = $request->get("type")) {
                case "Web": return resolve(UserWeb::class);
                case "Token": return resolve(UserToken::class);
                default: throw new \Exception("Could not resolve UserUpsert. unsupported user type: '{$type}'");
            }
        });
    }
}
