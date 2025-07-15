<?php


use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SongController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use function Termwind\render;



/* Route::get('/', function () {
    return inertia('Home', ['name' => 'Thomas']);
}); */

Route:: get('/dashboard', [SongController::class,'index'] );

Route::inertia('/login','Auth/Login');

//Route::post('/login', [AuthController::class,'login']);

/* Route::post('/logout', [AuthController::class,'logout'])->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']); */
