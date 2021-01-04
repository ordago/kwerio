<?php

namespace Database\Factories;

use App\Models\ApiUser;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ApiUserFactory extends Factory {
    protected $model = ApiUser::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "uuid" => (string) Str::uuid(),
            "name" => $this->faker->sentence,
            "is_hashed" => false,
            "token" => Str::random(48),
            "expires_at" => null,
        ];
    }

    public function configure() {
        return $this->afterMaking(function(ApiUser $apiUser) {
            if ($apiUser->is_hashed) {
                $apiUser->token = hash("sha256", $apiUser->token);
            }
        })->afterCreating(function(ApiUser $apiUser) {

        });
    }

    public function hashed() {
        $token = Str::random(48);

        return $this->state(function($attributes) {
            return [
                "is_hashed" => true,
            ];
        });
    }
}
