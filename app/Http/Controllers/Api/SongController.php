<?php

namespace App\Http\Controllers\Api;

use App\Models\Song;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Playlist;
use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SongController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user(); // Get the currently authenticated user

        // Get query parameters from the request with default values
        $view = $request->input('view', 'mysongs');   // e.g., 'mysongs' or 'allsongs'
        $genre = $request->input('genre');            // Optional genre filter
        $sort = $request->input('sort', 'desc');      // Sorting direction for release_date

        $query = Song::query();

        // If the user is not an admin, or the view is not 'allsongs',
        // limit the query to only the songs created by the current user
        if (!$user->isAdmin() || $view !== 'allsongs') {
            $query->where('user_id', $user->id);
        }

        // If a genre is provided, filter the query to that genre
        if (!empty($genre)) {
            $query->where('genre', $genre);
        }

        // Sort the results by release date (asc or desc) and paginate (50 per page)
        $songs = $query->orderBy('release_date', $sort)->paginate(50);

        // Keep other query parameters (e.g., view, genre, sort) in the pagination links,
        // but exclude the 'page' param
        $songs->appends($request->except('page'));

        // Return the paginated songs and the selected view as JSON
        return response()->json([
            'songs' => $songs,
            'view' => $view,
        ]);
    }


    // Validate using the required restrictions and create a new song for the authenticated user.

    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $this->authorize('create', Song::class);

        $song = Song::create([
            ...$request->validate([
                'title' => 'required|string|max:100',
                'description' => 'nullable|string',
                'genre' => 'required|string|max:55|in:Classical,Pop,Rock,Hip-hop,Electronic,Jazz',
                'release_date' => 'required|date'
            ]),
            'user_id' => $user->id
        ]);

        if ($request->playlist_id) {
            $playlist = Playlist::find($request->playlist_id);
            $playlist->songs()->attach($song->id);
        }
        return [
            'song' => $song,
            'user' => $song->user,
        ];
    }

    // Show details of a specific song after authorization.
    public function show(Song $song)
    {
        $this->authorize('view', $song);

        return [
            'song' => $song,
            'user' => $song->user,
        ];
    }

    // Validate and update the given song if the user is authorized.
    public function update(Request $request, Song $song)
    {
        $this->authorize('update', $song);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:100',
            'description' => 'nullable|string',
            'genre' => 'sometimes|string|max:55',
            'release_date' => 'sometimes|date'
        ]);

        $song->update($validated);

        return response()->json(['message' => 'Song updated successfully.']);
    }

    // Delete the specified song after checking permissions.
    public function destroy(Song $song)
    {
        $this->authorize('delete', $song);

        $song->delete();

        return response('Song deleted successfully!');
    }
}
