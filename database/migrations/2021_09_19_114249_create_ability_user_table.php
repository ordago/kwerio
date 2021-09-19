<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ability_user', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->unsignedBigInteger("ability_group_id");
            $table->unsignedBigInteger("user_id");
            $table->unsignedBigInteger("ability_id");
            $table->unsignedBigInteger("group_id");

            $table->unique([
                "ability_group_id",
                "user_id",
                "ability_id",
                "group_id",
            ]);

            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
            $table->foreign("ability_group_id")->references("id")->on("ability_group")->onDelete("cascade");
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
        Schema::dropIfExists('ability_user');
    }
};
