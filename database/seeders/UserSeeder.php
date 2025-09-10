<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@Apps.com',
            'password' => Hash::make('adminKu'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Regular Users
        $users = [
            [
                'name' => 'Farhan',
                'email' => 'farhan@apps.com',
                'password' => Hash::make('userKu'),
            ],
            [
                'name' => 'Siti Nurhaliza',
                'email' => 'siti@apps.com',
                'password' => Hash::make('userKu'),
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@apps.com',
                'password' => Hash::make('userKu'),
            ],
            [
                'name' => 'Rina Wijaya',
                'email' => 'rina@apps.com',
                'password' => Hash::make('userKu'),
            ],
            [
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad@apps.com',
                'password' => Hash::make('userKu'),
            ],
            [
                'name' => 'Maya Sari',
                'email' => 'maya@apps.com',
                'password' => Hash::make('userKu'),
            ],
            [
                'name' => 'Dedi Kurniawan',
                'email' => 'dedi@apps.com',
                'password' => Hash::make('userKu'),
            ],
            [
                'name' => 'Lestari Indah',
                'email' => 'lestari@apps.com',
                'password' => Hash::make('userKu'),
            ]
        ];

        foreach ($users as $userData) {
            User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => $userData['password'],
                'role' => 'user',
                'email_verified_at' => now(),
            ]);
        }
    }
}
