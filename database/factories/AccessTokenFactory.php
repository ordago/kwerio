<?php

namespace Database\Factories;

use App\Models\AccessToken;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AccessTokenFactory extends Factory {
    protected $model = AccessToken::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "uuid" => (string) Str::uuid(),
            "token" => hash("sha256", Str::random(48)),
        ];
    }
}
