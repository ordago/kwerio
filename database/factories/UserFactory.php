<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Kwerio\UserService\Upsert\{
    Web as UserWeb,
    Token as UserToken,
};

class UserFactory extends Factory {
    protected $model = User::class;

    public function definition() {
        $locale_iso_format = collect(get_locale_iso_formats())->pluck("label");
        $timezones = timezone_identifiers_list();
        $locales = collect(all_languages())->pluck("locale");
        $locale = $locales[mt_rand(0, count($locales) - 1)];

        return [
            "uuid" => (string) Str::uuid(),
            "email" => $this->faker->unique()->email,
            "locale" => $locale,
            "is_rtl" => is_rtl($locale),
            "timezone" => $timezones[mt_rand(0, count($timezones) - 1)],
            "locale_iso_format" => $locale_iso_format[mt_rand(0, count($locale_iso_format) - 1)],
        ];
    }

    function token() {
        return $this->state(function($attributes) {
            return [
                "type" => UserToken::TYPE,
                "payload" => [
                    "token" => Str::random(64),
                ],
            ];
        });
    }

    function web() {
        return $this->state(function($attributes) {
            return [
                "type" => UserWeb::TYPE,
                "password" => Hash::make("secret"),
                "first_name" => $this->faker->firstName,
                "last_name" => $this->faker->lastName,
            ];
        });
    }
}
