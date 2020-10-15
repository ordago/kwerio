<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupModuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('group_module', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger("group_id");
            $table->unsignedBigInteger("module_id");

            $table->foreign("group_id")->references("id")->on("groups");
            $table->foreign("module_id")->references("id")->on("modules");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('group_module');
    }
}
