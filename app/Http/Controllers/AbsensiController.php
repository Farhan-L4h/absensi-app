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

        // Ambil data absensi user untuk bulan & tahun
        $attendances = Attendance::where('user_id', $user->id)
            ->whereYear('waktu', $year)
            ->whereMonth('waktu', $month)
            ->orderBy('waktu')
            ->get()
            ->groupBy(fn($row) => Carbon::parse($row->waktu)->format('Y-m-d'));

        $recap = [];

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

        return response()->json([
            'user' => $user->name,
            'month' => $month,
            'year' => $year,
            'recap' => $recap,
        ]);
    }
}
