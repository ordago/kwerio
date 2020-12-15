<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->uuid("uuid");
            $table->string("email")->unique();
            $table->string("type");

            // ---------------------------------------------- Daemon User -- #
            $table->json("payload")->nullable();

            // ------------------------------------------------- Web User -- #
            $table->timestamp("owner_at")->nullable();
            $table->string("password")->nullable();
            $table->string("first_name")->nullable();
            $table->string("last_name")->nullable();

            // --------------------------------------------------- Common -- #
            $table->string("locale")->default("en");
            $table->boolean("is_rtl")->default(false);
            $table->string("timezone")->default("UTC");
            $table->timestamp("email_verified_at")->nullable();

            // @see Carbon\Traits\Date@getIsoFormats()
            $table->enum("locale_iso_format", ["LT", "LTS", "L", "LL", "LLL", "LLLL"])
                ->default("L");

            $table->rememberToken();
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
