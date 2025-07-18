<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SongController;
use Illuminate\Support\Facades\Route;


Route::inertia('/', 'Home');

Route::inertia('/dashboard', 'Songs/Dashboard');

Route::inertia('/login', 'Auth/Login');

Route::inertia('/register', 'Auth/Register');

Route::inertia('/store','Songs/Create');
