<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Song;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(100)->create()->each(function ($user) {
            Song::factory()->count(rand(1, 20))->create([
            'user_id' => $user->id,
            ]);
        });
    }
}
