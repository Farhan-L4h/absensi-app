<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ambil semua user kecuali admin
        $users = User::where('role', '!=', 'admin')->get();
        
        // Status absensi yang mungkin
        $statuses = ['Hadir', 'Telat', 'Alpha', 'Sakit', 'Izin'];
        
        // Koordinat kantor pusat (contoh: Jakarta)
        $kantorLat = -6.200000;
        $kantorLng = 106.816666;
        
        // Generate data untuk 30 hari terakhir
        for ($i = 30; $i >= 1; $i--) {
            $date = Carbon::now()->subDays($i);
            
            // Skip weekend (Sabtu-Minggu)
            if ($date->isWeekend()) {
                continue;
            }
            
            foreach ($users as $user) {
                // 85% kemungkinan user hadir
                if (rand(1, 100) <= 85) {
                    // Tentukan status
                    $randomStatus = rand(1, 100);
                    if ($randomStatus <= 70) {
                        $status = 'Hadir';
                        // Jam masuk normal: 08:00 - 09:00
                        $waktu = $date->copy()->setTime(8, rand(0, 59));
                    } elseif ($randomStatus <= 85) {
                        $status = 'Telat';
                        // Jam masuk telat: 09:01 - 10:30
                        $waktu = $date->copy()->setTime(9, rand(1, 59))->addMinutes(rand(0, 90));
                    } else {
                        $status = 'Hadir';
                        // Jam masuk sangat pagi: 07:00 - 07:59
                        $waktu = $date->copy()->setTime(7, rand(0, 59));
                    }
                    
                    // Variasi lokasi sekitar kantor (radius ~500m)
                    $latVariation = (rand(-50, 50) / 10000); // ±0.005 derajat
                    $lngVariation = (rand(-50, 50) / 10000); // ±0.005 derajat
                    
                    Attendance::create([
                        'user_id' => $user->id,
                        'waktu' => $waktu,
                        'status' => $status,
                        'lat' => $kantorLat + $latVariation,
                        'lng' => $kantorLng + $lngVariation,
                    ]);
                } else {
                    // 15% kemungkinan tidak hadir
                    $randomAbsent = rand(1, 100);
                    if ($randomAbsent <= 60) {
                        $status = 'Alpha';
                        $lat = null;
                        $lng = null;
                        $waktu = $date->copy()->setTime(8, 0); // Set waktu default
                    } elseif ($randomAbsent <= 80) {
                        $status = 'Sakit';
                        $lat = null;
                        $lng = null;
                        $waktu = $date->copy()->setTime(8, 0);
                    } else {
                        $status = 'Izin';
                        $lat = null;
                        $lng = null;
                        $waktu = $date->copy()->setTime(8, 0);
                    }
                    
                    Attendance::create([
                        'user_id' => $user->id,
                        'waktu' => $waktu,
                        'status' => $status,
                        'lat' => $lat,
                        'lng' => $lng,
                    ]);
                }
            }
        }
        
        // Tambahkan beberapa data untuk hari ini (jika hari kerja)
        $today = Carbon::now();
        if (!$today->isWeekend()) {
            foreach ($users->take(3) as $user) { // Hanya 3 user pertama yang sudah absen hari ini
                $waktuHariIni = $today->copy()->setTime(rand(7, 9), rand(0, 59));
                $status = $waktuHariIni->hour >= 9 ? 'Telat' : 'Hadir';
                
                Attendance::create([
                    'user_id' => $user->id,
                    'waktu' => $waktuHariIni,
                    'status' => $status,
                    'lat' => $kantorLat + (rand(-30, 30) / 10000),
                    'lng' => $kantorLng + (rand(-30, 30) / 10000),
                ]);
            }
        }
        
        $this->command->info('✅ Data attendance berhasil dibuat!');
        $this->command->info('📊 Total records: ' . Attendance::count());
        $this->command->info('👥 User dengan absensi: ' . User::whereHas('attendances')->count());
    }
}
