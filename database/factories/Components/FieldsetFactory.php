<?php

namespace Database\Factories\Components;

use Illuminate\Support\Str;
use App\Models\Components\Fieldset;
use Illuminate\Database\Eloquent\Factories\Factory;

class FieldsetFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Fieldset::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            "uuid" => Str::uuid(),
            "name" => $this->faker->words(2, true),
            "description" => $this->faker->sentence,
        ];
    }
}
