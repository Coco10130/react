<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('AuthToken')->plainTextToken;

            return response()->json(['user' => $user, 'token' => $token]);
        }

        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|min:4|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);

        if (!filter_var($validatedData['email'], FILTER_VALIDATE_EMAIL) || !preg_match('/@gmail\.com$/', $validatedData['email'])) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['email' => 'Only valid Gmail accounts are allowed to register.']);
        }

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
        ]);

        $token = $user->createToken('AuthToken')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function showUsers()
    {
        $users = User::all();

        return response()->json(['user' => $users]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $user->currentAccessToken()->delete();

        return response('', 204);
    }
}
