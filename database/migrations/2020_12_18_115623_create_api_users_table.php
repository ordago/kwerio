<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateApiUsersTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('api_users', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->index();
            $table->unsignedBigInteger("user_id");
            $table->string("name")->nullable();
            $table->boolean("is_hashed")->default(false);
            $table->string("token")->unique();
            $table->timestamp("expires_at")->nullable();
            $table->timestamp("last_used_at")->nullable();
            $table->timestamp("disabled_at")->nullable();
            $table->timestamps();

            $table->foreign("user_id")->references("id")->on("users")->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('api_users');
    }
}
