<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SongController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/* Define API routes for login, register, and logout endpoints handled by the AuthController.
Ensure that only authenticated users are allowed to access the logout route */

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

/* Define API routes for the 'songs' and 'dashboard', which automatically create
RESTful routes (index, store, show, update, destroy) handled by SongController.
The 'auth:sanctum' middleware ensures that only authenticated users can access these routes.

Route::apiResource('songs', SongController::class)->middleware('auth:sanctum');

Route::get('/dashboard', [SongController::class, 'index']);//->middleware('auth:sanctum'); */
