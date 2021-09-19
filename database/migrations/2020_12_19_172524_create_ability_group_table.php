<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbilityGroupTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create("ability_group", function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("group_id");
            $table->unsignedBigInteger("ability_id");
            $table->timestamps();

            $table->foreign("ability_id")->references("id")->on("abilities")->onDelete("cascade");
            $table->foreign("group_id")->references("id")->on("groups")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists("ability_group");
    }
}
