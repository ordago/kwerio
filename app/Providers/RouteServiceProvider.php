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
    public const HOME = '/home';

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
        $this->_register_module_routes();

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

    /**
     * Register modules routes.
     */
    private function _register_module_routes() {
        try {
            $module = resolve("module");
            $domain = config("app.domain");

            Route::domain("{tenant}.{$domain}")->group(function() use($module) {
                $path = "modules/{$module->uid}/routes";
                $middlewares = $module->config("router.middleware");

                $this->__register_web_routes($module, $path, $middlewares);
                $this->__register_api_routes($module, $path, $middlewares);
                $this->__register_webapi_routes($module, $path, $middlewares);
            });
        }

        catch (BindingResolutionException $e) {
            //
        }
    }

    /**
     * Register web routes.
     */
    private function __register_web_routes($module, $path, $middlewares) {
        $path = base_path("{$path}/web.php");
        $extra = [];

        if (!file_exists($path)) return;
        if ($module->auth) $extra = ["auth", "access.module"];

        Route::middleware(array_merge(["web"], $extra, $middlewares))
            ->prefix($module->config("router.prefix"))
            ->namespace($module->config("router.namespace"))
            ->group($path);
    }

    /**
     * Register api routes.
     */
    private function __register_api_routes($module, $path, $middlewares) {
        $path = base_path("{$path}/api.php");
        $extra = [];

        if (!file_exists($path)) return;
        if ($module->auth) $extra = ["auth:api", "access.module"];

        Route::middleware(array_merge(["api"], $extra, $middlewares))
            ->prefix($module->config("router.prefix") . "/api")
            ->namespace($module->config("router.namespace"))
            ->group($path);
    }

    /**
     * Register web api routes.
     */
    private function __register_webapi_routes($module, $path, $middlewares) {
        $path = base_path("{$path}/webapi.php");
        $extra = [];

        if (!file_exists($path)) return;
        if ($module->auth) $extra = ["auth:web,api", "access.module"];

        Route::middleware(array_merge(["webapi"], $extra, $middlewares))
            ->prefix($module->config("router.prefix") . "/api")
            ->namespace($module->config("router.namespace"))
            ->group($path);
    }
}
