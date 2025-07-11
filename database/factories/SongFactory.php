<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Song>
 */
class SongFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $genres = ['Classical', 'Pop', 'Rock', 'Hip-hop', 'Electronic', 'Jazz'];

        return [
            'title' => fake()->unique()->sentence(4),
            'description' => fake()->text,
            'genre'=> $this->faker->randomElement($genres),
            'release_date' => fake()->date($format = 'Y-m-d', $max = 'now'),
        ];
    }
}
