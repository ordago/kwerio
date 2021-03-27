<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFieldsetsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fieldsets', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->index();
            $table->unsignedBigInteger("fieldset_id")->nullable();
            $table->string("module")->nullable();
            $table->string("locale", 10);
            $table->string("name");
            $table->text("description")->nullable();
            $table->timestamp("disabled_at")->nullable();
            $table->timestamps();

            $table->unique(["module", "name"]);

            $table->foreign("fieldset_id")
                ->references("id")
                ->on("fieldsets")
                ->onDelete("cascade");

            $table->foreign(["module", "locale"])
                ->references(["module", "locale"])
                ->on("languages")
                ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('fieldsets');
    }
}
