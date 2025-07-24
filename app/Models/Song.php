<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Song extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'genre', 'release_date', 'user_id'];

    // Defines the relationship between User and Song. One User can have many songs. Each Song should have a User
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function playlists(){
        return $this->belongsToMany(Playlist::class);
    }
}
