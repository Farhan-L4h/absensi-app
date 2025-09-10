<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Attendance;
use App\Models\User;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $today = now()->toDateString();

        if ($user->role === 'admin') {
            // Dashboard data untuk admin
            $totalUsers = User::where('role', 'user')->count();
            $totalAbsensiHariIni = Attendance::whereDate('created_at', $today)->count();
            $recentAttendances = Attendance::with('user')
                ->whereDate('created_at', $today)
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($attendance) {
                    return [
                        'user' => $attendance->user,
                        'tanggal' => $attendance->created_at->format('d/m/Y'),
                        'waktu' => $attendance->created_at->format('H:i:s'),
                    ];
                });

            return Inertia::render('Dashboard', [
                'totalUsers' => $totalUsers,
                'totalAbsensiHariIni' => $totalAbsensiHariIni,
                'recentAttendances' => $recentAttendances,
            ]);
        } else {
            // Dashboard data untuk user biasa
            $sudahAbsen = Attendance::where('user_id', $user->id)
                ->whereDate('created_at', $today)
                ->exists();

            return Inertia::render('Dashboard', [
                'sudahAbsen' => $sudahAbsen,
            ]);
        }
    }
}