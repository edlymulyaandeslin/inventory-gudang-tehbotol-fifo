<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'super',
            'email' => 'super@gmail.com',
        ]);
        User::factory()->create([
            'name' => 'ripal',
            'email' => 'admin@gudang.com',
            'password' => 'password'
        ]);

        $this->call([
            ProductSeeder::class,
            StockInSeeder::class,
        ]);
    }
}