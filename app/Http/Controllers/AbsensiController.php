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
}
