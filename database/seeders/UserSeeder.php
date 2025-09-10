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
        User::create([
            'name' => 'Farhan',
            'email' => 'Farhan@Apps.com',
            'password' => Hash::make('userKu'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);
        // Create additional users using factory if needed
        // User::factory(10)->create();
    }
}
