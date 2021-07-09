<?php

namespace App\SystemModels;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\{
    DB,
    Schema,
};

class Tenant extends Model {
    use HasFactory;

    protected $connection = "system";

    /**
     * Switch to the given tenant.
     */
    static function switch($tenant) {
        $tenant = self::whereSubDomain($tenant)->firstOrFail();

        config([
            "database.connections.tenant.database" => $tenant->db_name,
            "database.connections.tenant.username" => $tenant->db_username,
            "database.connections.tenant.password" => $tenant->db_password,
            "database.connections.tenant.port" => $tenant->db_port,
        ]);

        DB::purge("tenant");
        DB::reconnect("tenant");
        Schema::connection("tenant")->getConnection()->reconnect();

        app()->forgetInstance("tenant");
        app()->instance("tenant", $tenant);

        return $tenant;
    }
}
