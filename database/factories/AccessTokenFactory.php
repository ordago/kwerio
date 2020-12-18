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
        $is_hashed = (bool) mt_rand(0, 1);
        $token = Str::random(48);
        $token = $is_hashed ? hash("sha256", $token) : $token;

        return [
            "uuid" => (string) Str::uuid(),
            "name" => $this->faker->sentence,
            "is_hashed" => $is_hashed,
            "token" => $token,
        ];
    }
}
