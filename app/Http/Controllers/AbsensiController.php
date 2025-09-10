<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\ValidationException;

// inertia
use Inertia\Inertia;

// use carbon
use Carbon\Carbon;
use Carbon\CarbonPeriod;

// models
use App\Models\Attendance;
use App\Models\User;


class AbsensiController extends Controller
{

    public function store(Request $request)
    {
        $user = auth()->user();

        $sudahAbsen = Attendance::whereDate('created_at', today())
            ->where('user_id', $user->id)
            ->exists();

        if ($sudahAbsen) {
            throw ValidationException::withMessages([
                'absen' => 'Kamu sudah absen hari ini.',
            ]);
        }

        Attendance::create([
            'user_id' => $user->id,
            'lat' => $request->lat,
            'lng' => $request->lng,
            'waktu' => now(),
            'status' => 'hadir', // misal
        ]);

        return redirect()->back();
    }

    // recap Absensi
    public function recap(Request $request)
    {
        return Inertia::render('RecapAbsensi');
    }

    public function recap_show(Request $request)
    {
        $user = $request->user();
        $month = $request->query('month', now()->format('m'));
        $year = $request->query('year', now()->format('Y'));

        $recap = [];

        if ($user->role === 'admin') {
            // Admin melihat semua data absensi
            $attendances = Attendance::with('user')
                ->whereYear('waktu', $year)
                ->whereMonth('waktu', $month)
                ->orderBy('waktu', 'desc')
                ->get();

            foreach ($attendances as $attendance) {
                $recap[] = [
                    'tanggal' => Carbon::parse($attendance->waktu)->format('Y-m-d'),
                    'hari' => Carbon::parse($attendance->waktu)->translatedFormat('l'),
                    'jam' => Carbon::parse($attendance->waktu)->format('H:i'),
                    'status' => $attendance->status,
                    'user_name' => $attendance->user->name,
                ];
            }
        } else {
            // User biasa hanya melihat data mereka sendiri
            $attendances = Attendance::where('user_id', $user->id)
                ->whereYear('waktu', $year)
                ->whereMonth('waktu', $month)
                ->orderBy('waktu')
                ->get()
                ->groupBy(fn($row) => Carbon::parse($row->waktu)->format('Y-m-d'));

            foreach ($attendances as $date => $records) {
                $dayName = Carbon::parse($date)->translatedFormat('l');
                $jamMasuk = optional($records->sortBy('waktu')->first())->waktu;
                $jamFormatted = $jamMasuk ? Carbon::parse($jamMasuk)->format('H:i') : '-';
                $status = $records->pluck('status')->implode(', ');

                $recap[] = [
                    'tanggal' => $date,
                    'hari' => $dayName,
                    'jam' => $jamFormatted,
                    'status' => $status,
                ];
            }
        }

        return response()->json([
            'user' => $user->name,
            'user_role' => $user->role,
            'month' => $month,
            'year' => $year,
            'recap' => $recap,
        ]);
    }
}
