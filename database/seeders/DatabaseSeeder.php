<?php

namespace Database\Seeders;

use App\Models\Playlist;
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
        /* Creates 100 users using the User factory and for each user creates a random number of songs
        between 1 and 20 using the Song factory */

        User::factory(50)->create()->each(function ($user) {
            $songs = Song::factory()->count(rand(5, 15))->create([
                'user_id' => $user->id,
            ]);

            $playlists = Playlist::factory()->count(rand(2, 5))->create([
                'user_id' => $user->id,
            ]);

            foreach ($playlists as $playlist) {
                $randomSongs = $songs->random(rand(2, min(6, $songs->count())));
                $playlist->songs()->attach($randomSongs->pluck('id'));
            }
        });
    }
}
