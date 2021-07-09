<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->index();
            $table->unsignedBigInteger("user_id")->nullable();

            $table->timestamp("owner_at")->nullable();
            $table->string("first_name")->nullable();
            $table->string("last_name")->nullable();
            $table->string("email")->unique();
            $table->string("password");
            $table->rememberToken();
            $table->string("locale")->default("en");
            $table->boolean("is_rtl")->default(false);
            $table->string("timezone")->default("UTC");
            $table->timestamp("email_verified_at")->nullable();
            $table->enum("locale_iso_format", ["LT", "LTS", "L", "LL", "LLL", "LLLL"])->default("L");
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
        Schema::dropIfExists('users');
    }
}
