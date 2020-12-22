<?php

namespace App\Http\Middleware;

use ReflectionClass;
use Closure;
use Illuminate\Http\Request;
use App\Http\Kernel;
use Illuminate\Routing\Pipeline;

class WebApi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next) {
        $middlewareGroups = app(Kernel::class)->getMiddlewareGroups();

        $middlewares = is_null($request->bearerToken())
            ? $middlewareGroups["web"]
            : $middlewareGroup["api"];

        return resolve(Pipeline::class)
            ->send($request)
            ->through($middlewares)
            ->then(function($request) use($next) {
                return $next($request);
            });
    }
}
