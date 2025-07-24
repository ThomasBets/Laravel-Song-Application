<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Playlist>
 */
class PlaylistFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $visbilities = ['private', 'public'];

        return [
            'title' => fake()->unique->sentence(3),
            'visibility' => $this->faker->randomElement($visbilities),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
        ];
    }
}
