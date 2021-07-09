<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLanguagesTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->index();
            $table->string("module")->nullable();
            $table->string("locale", 10);
            $table->string("name");
            $table->string("native_name");
            $table->timestamp("default_at")->nullable();
            $table->timestamp("disabled_at")->nullable();
            $table->timestamps();

            $table->unique(["locale", "module"]);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('languages');
    }
}
