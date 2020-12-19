<?php

namespace App\Providers;

use Kwerio\AccessTokenGuard;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
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

        Gate::before(function($user) {
            if ($user->is_owner()) {
                return true;
            }
        });

        Auth::extend("access-token", function($app, $name, array $config) {
            return new AccessTokenGuard();
        });
    }
}
