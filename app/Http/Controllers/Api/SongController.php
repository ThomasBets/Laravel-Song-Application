<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Song;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Resources\SongResource;
use User as GlobalUser;
use Illuminate\Support\Facades\Auth;

class SongController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $query = Song::query();

        if ($user->isRegularUser()) {
            $query->where('user_id', $user->id);
        }

        if ($request->has('genre')) {
            $query->where('genre', $request->input('genre'));
        }

        $sort = $request->input('sort', 'desc');
        $query->orderBy('release_date', $sort);

        return $query->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $this->authorize('create', Song::class);

        $song = Song::create([
            ...$request->validate([
            'title' =>'required|string|max:100',
            'description'=> 'nullable|string',
            'genre'=> 'required|string|max:55|in: Classical, Pop, Rock, Hip-hop, Electronic, Jazz',
            'release_date'=> 'required|date'
            ]),
            'user_id' => $user->id
        ]);
        return $song;
    }

    /**
     * Display the specified resource.
     */
    public function show(Song $song)
    {
        $this->authorize('view', $song);

        return $song;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Song $song)
    {
        $this->authorize('update', $song);

        $validated = $request->validate([
            'title' =>'sometimes|string|max:100',
            'description'=> 'nullable|string',
            'genre'=> 'sometimes|string|max:55',
            'release_date'=> 'sometimes|date'
        ]);

        $song->update($validated);

        return response()->json([
            'message'=> 'Song updated successfully!',
            'data' => $song
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Song $song)
    {
        $this->authorize('delete', $song);

        $song->delete();

        return response('Song deleted successfully!');
    }
}
