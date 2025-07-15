<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    // Authenticates user and returns an API token if credentials are valid.
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        $user = User::where("email", $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages(["email" => "The provided credentials are incorrect"]);
        }

        if (!Hash::check($request->password, (string)$user->password)) {
            throw ValidationException::withMessages(["email" => "The provided credentials are incorrect"]);
        }

        $token = $user->createToken("api-token")->plainTextToken;

        return response()->json([
            'token' => $token,
            'message' => 'Logged in successfully!'
        ]);
    }

    // Registers a new user with validated input and hashed password using some restrictions rules.
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|max:15|confirmed',
            'role' => 'required|in:admin,regular_user'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role']
        ]);

        return response()->json([
            'message' => 'You have registered successfully!'
        ]);
    }

    // Revokes all tokens for the authenticated user to log them out.
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully!'
        ]);
    }
}
