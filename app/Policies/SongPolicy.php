<?php

namespace App\Policies;

use Illuminate\Auth\Access\Response;
use App\Models\Song;
use App\Models\User;

class SongPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Song $song): bool
    {
        return $user->id === $song->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Song $song): bool
    {
        return $user->id === $song->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Song $song): bool
    {
        return $user->id === $song->user_id || $user->isAdmin();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Song $song): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
     public function forceDelete(User $user, Song $song): bool
    {
        return false;
    }
}
