<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAccessTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('access_tokens', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid");
            $table->timestamps();
            $table->unsignedBigInteger("user_id");
            $table->string("name")->nullable();
            $table->boolean("is_hashed")->default(false);
            $table->string("token")->unique();
            $table->timestamp("expired_at")->nullable();
            $table->timestamp("last_used_at")->nullable();

            $table->foreign("user_id")
                ->references("id")
                ->on("users");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('access_tokens');
    }
}
