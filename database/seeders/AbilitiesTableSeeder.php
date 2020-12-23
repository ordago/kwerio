<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ability;

class AbilitiesTableSeeder extends Seeder
{
    public $abilities = [
        // Users
        "root/user_list" => "List available users",
        "root/user_create" => "Create new user",
        "root/user_update" => "Update an existing user",
        "root/user_delete" => "Delete existing user",
        "root/user_delete_root" => "Delete root user",

        // Groups
        "root/group_list" => "List available groups",
        "root/group_create" => "Create new group",
        "root/group_update" => "Update an existing group",
        "root/group_delete" => "Delete existing group",

        // Access tokens
        "root/access_token_list" => "List available access tokens",
        "root/access_token_create" => "Create new access token",
        "root/access_token_update" => "Update existing access token",
        "root/access_token_delete" => "Delete existing access token",
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        foreach ($this->abilities as $ability => $description) {
            Ability::firstOrCreate(["name" => $ability], [
                "name" => $ability,
                "description" => $description,
            ]);
        }
    }
}
