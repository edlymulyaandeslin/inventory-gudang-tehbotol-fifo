<?php

namespace Database\Factories;

use App\Models\Batch;
use App\Models\StockOut;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StockOutDetail>
 */
class StockOutDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "stock_out_id" => StockOut::inRandomOrder()->first()->id,
            "batch_id" => Batch::inRandomOrder()->first()->id, // Assuming batch_id is a foreign key to a Batch model
            "quantity_used" => fake()->numberBetween(1, 100),
        ];
    }
}