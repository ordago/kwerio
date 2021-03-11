<?php

namespace Database\Factories\Components;

use App\Models\Components\Language;
use Illuminate\Database\Eloquent\Factories\Factory;

class LanguageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Language::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $languages = all_languages();
        $language = $languages[mt_rand(0, count($languages) - 1)];

        return [
            "name" => $language["name"],
            "locale" => $language["locale"],
            "native_name" => $language["native_name"],
            "module" => ucfirst($this->faker->word),
            "default_at" => null,
        ];
    }
}
