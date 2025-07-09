<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

// models
use App\Models\Attendance;

class AbsensiController extends Controller
{
    public function store(Request $request)
    {
        // Validasi input
        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        // Cek apakah user sudah absen hari ini
        $user = auth()->user();

        // Cek apakah user sudah absen hari ini
        $sudahAbsen = \App\Models\Attendance::whereDate('waktu', now()->toDateString())
            ->where('user_id', $user->id)
            ->exists();

        if ($sudahAbsen) {
            return back()->withErrors(['message' => 'Kamu sudah absen hari ini!']);
        }

        // Cek apakah sudah lewat jam 07:30
        $status = now()->format('H:i') > '07:30' ? 'telat' : 'hadir';

        Attendance::create([
            'user_id' => $user->id,
            'waktu' => now(),
            'lat' => $request->lat,
            'lng' => $request->lng,
            'status' => $status,
        ]);


        // Redirect dengan pesan sukses
        return redirect()->route('absen')->with('message', 'Absensi berhasil!');
    }
}
