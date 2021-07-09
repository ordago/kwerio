<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserablesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('userables', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->index();
            $table->unsignedBigInteger("user_id");
            $table->string("user_email")->nullable();
            $table->enum("user_type", ["web", "api"]);
            $table->string("user_model");
            $table->morphs("userable");
            $table->string("action")->index();
            $table->text("meta")->nullable();
            $table->timestamp("created_at");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('userables');
    }
}
