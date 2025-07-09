<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Attendance;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $today = now()->toDateString();

        $sudahAbsen = Attendance::where('user_id', $user->id)
            ->whereDate('created_at', $today)
            ->exists();

        return Inertia::render('Dashboard', [
            'sudahAbsen' => $sudahAbsen,
        ]);
    }
}