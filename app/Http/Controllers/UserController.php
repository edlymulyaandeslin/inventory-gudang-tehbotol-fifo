<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($search = $request->search) {
            $query->where("name", "like", "%{$search}%");
        }

        $users = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("users/index", [
            "users" => $users,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("users/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required",
            "email" => "required|email|unique:users,email",
            'password' => 'required|min:8',
            'password_confirmation' => 'required|min:8|confirmed:password',
        ]);

        $data_input = $request->only('name', 'email', 'password');

        User::create($data_input);

        return redirect()->route("users.index")->with("success", "User berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('users/edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            "name" => "required",
            "email" => "required|email|unique:users,email," . $user->id,
            'password' => 'nullable|min:8',
            'password_confirmation' => 'nullable|min:8|confirmed:password',
        ]);

        $data_input = $request->only('name', 'email', 'password');

        if (!$request->password) {
            $data_input['password'] = $user->password;
        }

        $user->update($data_input);

        return redirect()->route('users.index')->with('success', 'User berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus!');
    }
}