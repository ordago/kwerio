<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAbilitablesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('abilitables', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger("ability_id");
            $table->morphs("abilitable");
            $table->timestamps();

            $table->foreign("ability_id")->references("id")->on("abilities")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('abilitables');
    }
}
