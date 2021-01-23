<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        if (config("app.env") === "local") {
            $path = request()->path();
            $line = "\n\n\n [ " . date("Y-m-d H:isi") . " ] [ NEW REQUEST ] {$path}\n\n";
            file_put_contents(storage_path("/logs/sql_queries.log"), $line, FILE_APPEND);

            DB::listen(function($query) {
                $line = "[" . date("Y-m-d H:i:s") . "] [{$query->time} ms] {$query->sql} [ " . implode(",", $query->bindings) . " ]\n";

                file_put_contents(storage_path("/logs/sql_queries.log"), $line, FILE_APPEND);
            });
        }
    }
}
