<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Playlist;
use App\Models\Song;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'nullable|string',
            'genre' => 'required|string|max:55|in:Classical,Pop,Rock,Hip-hop,Electronic,Jazz',
            'release_date' => 'required|date',
            'audio_file' => 'required|file|mimes:mp3,wav,aac,ogg|max:1024',
        ]);


        $song = new Song();
        $song->title = $validated['title'];
        $song->description = $validated['description'] ?? null;
        $song->genre = $validated['genre'];
        $song->release_date = $validated['release_date'];
        $song->user_id = $user->id;

        if ($request->hasFile('audio_file')) {
            $path = $request->file('audio_file')->store('audio', 'public');
            $fileName = basename($path);
            $song->audio_file_path = $path;

            $song->save();

            if ($request->playlist_id) {
                $playlist = Playlist::find($request->playlist_id);
                if ($playlist) {
                    $playlist->songs()->attach($song->id);
                }
            }

            return [
                'song' => $song,
                'user' => $song->user,
            ];
        }
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
            'release_date' => 'sometimes|date',
            'audio_file' => 'nullable|file|mimes:mp3,wav,aac,ogg|max:10240',
        ]);

        if ($request->hasFile('audio_file')) {

            Storage::delete('public/' . $song->audio_file_path);

            $path = $request->file('audio_file')->store('public/audio');
            $fileName = basename($path);

            $validated['audio_file_path'] = 'audio/' . $fileName;
        }

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
