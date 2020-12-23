<?php

namespace Database\Factories;

use App\Models\Ability;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AbilityFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Ability::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition() {
        return [
            "name" => Str::slug($this->faker->words(mt_rand(1, 3), true)),
            "description" => $this->faker->sentence,
        ];
    }
}
