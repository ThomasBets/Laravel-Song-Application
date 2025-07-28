<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Home');

Route::inertia('/login', 'Auth/Login');

Route::inertia('/register', 'Auth/Register');

Route::inertia('/store', 'Songs/Create');

Route::inertia('/dashboard', 'Songs/Dashboard');

Route::inertia('/songs/{id}', 'Songs/Show');

Route::inertia('/songs/{id}/edit', 'Songs/Edit');

Route::inertia('/pDashboard', 'Playlists/PlaylistDashboard');

Route::inertia('/pStore', 'Playlists/PlaylistCreate');

Route::inertia('/playlists/edit/{id}', 'Playlists/PlaylistEdit');

Route::inertia('/playlists/{id}', 'Playlists/PlaylistShow');


