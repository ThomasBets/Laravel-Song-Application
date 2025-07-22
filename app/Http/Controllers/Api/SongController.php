<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Song;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SongController extends Controller
{
    use AuthorizesRequests;

    // List songs, filtered genre with a Query Builder Object, and sorted by release date.
    public function index(Request $request)
    {

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $query = Song::query();
        $view = $request->input('view', 'mysongs');
        $sort = $request->input('sort', 'desc');


        //Checking the users' role using of the helper 'isAdmin' that is defined at the User Model
        if ($user->isAdmin()) {
            if ($view == 'allsongs') {

                if ($request->has('genre')) {
                    $query->where(
                        'genre',
                        $request->input('genre')
                    );
                }
            } else {
                $query->where('user_id', $user->id);

                if ($request->has('genre')) {
                    $query->where(
                        'genre',
                        $request->input('genre')
                    );
                }
            }
        } else {
            $query->where('user_id', $user->id);

            if ($request->has('genre')) {
                $query->where(
                    'genre',
                    $request->input('genre')
                );
            }
        }

        $songs = $query->orderBy('release_date', $sort)->paginate(50);
        $songs->appends($request->except('page'));

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
