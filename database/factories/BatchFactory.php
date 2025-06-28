<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Batch>
 */
class BatchFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $randomQuantity = mt_rand(400, 1000);
        return [
            "product_id" => Product::inRandomOrder()->first()->id,
            "quantity" => $randomQuantity,
            "remaining_qty" => $randomQuantity,
            "entry_date" => fake()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}