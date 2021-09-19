<?php

namespace App\Console\Commands;

use App\SystemModels\Tenant;
use Illuminate\Console\Command;

class TenantSeedCommand extends Command {
    protected $signature = "tenant:seed {tenant : The name of the tenant}
        {--c|class= : The class name of the root seeder}";

    protected $description = "Seed the tenant database with records";

    /**
     * Execute the console command.
     */
    function handle() {
        $tenant = Tenant::switch($this->argument("tenant"));

        $options = [];

        if ($class = $this->option("class")) {
            $options = array_merge($options, ["--class" => $class]);
        }

        $this->call("db:seed", $options);
    }
}
