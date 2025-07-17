<?php


use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SongController;
use Illuminate\Support\Facades\Route;



/* Route::get('/', function () {
    return inertia('Home', ['name' => 'Thomas']);
}); */

Route::inertia("/", 'Welcome');

Route::inertia('/home', 'Home');

Route::get('/dashboard', [SongController::class, 'index']);//->middleware('auth:sanctum');

Route::inertia('/login', 'Auth/Login')->name('login');

Route::post('/login', [AuthController::class,'login']);

Route::inertia('/register', 'Auth/Register');

/*
Route::post('/logout', [AuthController::class,'logout'])->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);

Route::apiResource('songs', SongController::class)->middleware('auth:sanctum'); */
