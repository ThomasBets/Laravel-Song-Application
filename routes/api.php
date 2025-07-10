<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SongController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('users.songs',SongController::class)->scoped()->middleware('auth:sanctum');

Route::post('/login', [AuthController::class,'login']);

Route::post('/logout', [AuthController::class,'logout'])->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);

Route::get('/dashboard', [SongController::class,'index'])->middleware('auth:sanctum');
