<?php

namespace App\Providers;

use Illuminate\Contracts\Container\BindingResolutionException;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            // The following routes are only accessible through a web inerface,
            // And it should not be allowed to fetch data/pages from them using
            // an api.
            //
            // USE: 'auth:web' or 'auth' to allow only authenticated web
            // requests.
            Route::middleware("web")
                ->namespace($this->namespace)
                ->group(base_path("routes/web.php"));

            // The following routes can be accessed from the web interface, as
            // well as the api.
            //
            // USE: 'auth:web,api' or 'auth:api,web' to allow authenticated
            // web and api requests.
            Route::prefix("api")
                ->middleware("webapi")
                ->namespace($this->namespace)
                ->group(base_path("routes/webapi.php"));

            // The following routes are only accessible using an api.
            //
            // USE: 'auth:api' to allow only authenticated api requests.
            Route::prefix("api")
                ->middleware("api")
                ->namespace($this->namespace)
                ->group(base_path("routes/api.php"));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });
    }
}
