<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        User::create([
            "owner_at" => now(),
            "email" => config("app.root_user.email"),
            "password" => Hash::make(config("app.root_user.password")),
            "first_name" => config("app.root_user.first_name"),
            "last_name" => config("app.root_user.last_name"),
            "locale" => config("app.root_user.locale"),
            "is_rtl" => config("app.root_user.is_rtl"),
            "timezone" => config("app.root_user.timezone"),
            "locale_iso_format" => config("app.root_user.locale_iso_format"),
            "email_verified_at" => now(),
        ]);
    }
}
