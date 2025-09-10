<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Attendance;

class AdminController extends Controller
{
    public function users()
    {
        $users = User::where('role', 'user')
            ->withCount('attendances')
            ->get();

        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    public function createUser()
    {
        return Inertia::render('Admin/CreateUser');
    }

    public function storeUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'user',
        ]);

        return redirect()->route('admin.users')->with('success', 'Berhasil! User "' . $user->name . '" telah ditambahkan ke sistem.');
    }

    public function editUser(User $user)
    {
        return Inertia::render('Admin/EditUser', [
            'user' => $user
        ]);
    }

    public function updateUser(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->password) {
            $user->update([
                'password' => bcrypt($request->password),
            ]);
        }

        return redirect()->route('admin.users')->with('success', 'Data user "' . $user->name . '" berhasil diperbarui!');
    }

    public function deleteUser(User $user)
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'Tidak dapat menghapus user admin!');
        }

        $userName = $user->name;
        $user->delete();

        return redirect()->route('admin.users')->with('success', 'User "' . $userName . '" berhasil dihapus dari sistem!');
    }
}
