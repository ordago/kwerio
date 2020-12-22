<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ability;

class AbilitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $abilities = [
            "create_access_tokens" => "Create Access Tokens",
        ];

        foreach ($abilities as $ability => $description) {
            Ability::firstOrCreate([
                "name" => $ability,
                "description" => $description,
            ]);
        }
    }
}
