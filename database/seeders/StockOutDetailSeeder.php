<?php

namespace Database\Seeders;

use App\Models\StockOutDetail;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class StockOutDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        StockOutDetail::factory(10)->create();
    }
}