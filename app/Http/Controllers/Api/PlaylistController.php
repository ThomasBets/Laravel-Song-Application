<?php

namespace App\Http\Controllers\Api;

use Inertia\Inertia;
use App\Models\Playlist;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class PlaylistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user(); // Get the currently authenticated user

        $type = $request->query("type", 'personal');

        if ($type == 'personal') {
            $playlists = Playlist::with('user')->where('user_id', $user->id)->get();
        } else if ($type == "public") {
            $playlists = Playlist::with('user')->where('visibility', 'public')->where('user_id', '!=', $user->id)->get();
        } else {
            return response()->json(['error' => 'Invalid type'], 400);
        }
        return response()->json([
            'playlists' => $playlists,
            'type' => $type
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $this->authorize('create', Playlist::class);

        $playlist = Playlist::create([
            ...$request->validate([
                'title' => 'required|string|max:100',
                'visibility' => 'required|string|max:55|in:private,public',
            ]),
            'user_id' => $user->id
        ]);

        return $playlist;
    }

    /**
     * Display the specified resource.
     */
    public function show(Playlist $playlist)
    {
        $this->authorize('view', $playlist);

        $playlist->load('songs', 'user');

        return response()->json([
            'playlist' => $playlist
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Playlist $playlist)
    {
        $this->authorize('update', $playlist);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:100',
            'visibility' => 'required|string|max:55|in:private,public',
        ]);

        $playlist->update($validated);

        return response()->json(['message' => 'Playlist updated successfully.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Playlist $playlist)
    {
        $this->authorize('delete', $playlist);

        $playlist->delete();

        return response()->json(['message' => 'Playlist updated successfully.']);
    }

    // PlaylistController.php

public function detachSong(Request $request, $playlistId, $songId)
{
    $playlist = Playlist::findOrFail($playlistId);

    $this->authorize('update', $playlist);

    $playlist->songs()->detach($songId);

    return response()->json(['message' => 'Song removed from playlist.']);
}

}
