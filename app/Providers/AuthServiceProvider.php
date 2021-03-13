<?php

namespace App\Providers;

use Illuminate\Auth\EloquentUserProvider;
use Database\Seeders\AbilitiesTableSeeder;
use Kwerio\TokenGuard;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Extensions\ApiUserProvider;
use App\Models\Ability;

use Illuminate\Support\Facades\{
    Gate,
    Auth,
};

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Auth::extend("token", function($app, $name, array $config) {
            $guard = new TokenGuard(
                new EloquentUserProvider($app["hash"], $app["config"]["auth.providers.{$config["provider"]}.model"]),
                $app["request"],
                "token",
                "token",
                false           // hash is defined in the token
            );

            $app->refresh("request", $guard, "setRequest");

            return $guard;
        });

        $this->_register_abilities();
    }

    /**
     * Register abilities.
     */
    private function _register_abilities() {
        try {
            $abilities = Ability::where("name", "like", "root/%")->get(["name", "description"]);
        }

        catch (\PDOException $e) {
            logger($e);
            $abilities = [];
        }

        foreach ($abilities as $ability) {
            Gate::define($ability["name"], function($user) use($ability) {
                if ($user->is_owner()) {
                    return true;
                }

                return $user->isAbleTo($ability["name"]);
            });
        }
    }
}
