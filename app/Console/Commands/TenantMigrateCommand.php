<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\SystemModels\Tenant;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

use App\Models\{
    Module as ModuleModel,
    Group,
};

class TenantMigrateCommand extends Command {
    protected $signature = "tenant:migrate {tenant} {--m|modules=} {--s|seed}";
    protected $description = "Migrate tenant database";

    /**
     * Execute the console command.
     */
    function handle() {
        $tenant = Tenant::switch($this->argument("tenant"));

        DB::beginTransaction();

        $this->_migrate_tenant_core($tenant);
        $this->_migrate_tenant_modules($tenant);
        $this->_migrate_tenant_custom_modules($tenant);
        $this->_seed($tenant);

        DB::commit();
    }

    /**
     * Migrate tenant base tables.
     */
    private function _migrate_tenant_core(Tenant $tenant) {
        $this->line("");
        $this->comment("[ {$tenant->db_name} ]  Migrating tenant core");
        $this->call("migrate");
    }

    /**
     * Migrate modules.
     */
    private function _migrate_tenant_modules(Tenant $tenant) {
        $uids = explode(",", $this->option("modules") ?? "");

        foreach ($uids as $uid) {
            $this->line("");
            $this->comment("[ {$tenant->db_name} ]  Migrating module {$uid}");

            $path = "modules/{$uid}/database/migrations";

            $this->call("migrate", [
                "--path" => $path,
            ]);

            $this->__install_module($uid);
        }
    }

    /**
     * Migrate modules that are custom built for this tenant.
     */
    private function _migrate_tenant_custom_modules(Tenant $tenant) {
        $parent = Str::studly($tenant->sub_domain);
        $parent_path = base_path("modules/{$parent}");

        if (file_exists("{$parent_path}/Module.php")) return;

        $modules = resolve("modules")->built_for_tenant($tenant);

        foreach ($modules as $module) {
            if (!file_exists("{$module->path}/database/migrations")) {
                $this->line("");
                $this->comment("[ {$parent}/{$module->uid} ] Has no migrations");
                continue;
            }

            $this->line("");
            $this->comment("[ $tenant->db_name ] Migrating module {$parent}/{$module->uid}");

            $this->call("migrate", [
                "--path" => "modules/{$parent}/{$module->uid}/database/migrations",
            ]);

            $this->__install_module($module->uid);
        }
    }

    private function _seed() {
        if (!$this->option("seed")) return;

        $this->call("db:seed");
    }

    private function __install_module(string $module_uid) {
        $module = ModuleModel::updateOrCreate(["uid" => $module_uid], [
            "uid" => $module_uid,
        ]);

        $group = Group::updateOrCreate(["slug" => $module], [
            "slug" => $module->uid,
            "name" => $module->name ?? $module->uid,
        ]);

        $group->modules()->sync($module);
    }
}
