<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up() {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid");
            $table->timestamps();
            $table->softDeletes();
            $table->string("sub_domain");
            $table->string("db_host")->default("host.docker.internal");
            $table->string("db_name");
            $table->string("db_port")->default("5432");
            $table->string("db_password");
            $table->string("db_username")->default("postgres");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down() {
        Schema::dropIfExists('tenants');
    }
};
