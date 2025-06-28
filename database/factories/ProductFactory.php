<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->unique()->randomElement([
                'Teh Botol 250ml',
                'Teh Botol 350ml',
                'Teh Kotak 250ml',
                'Teh Kaleng 330ml',
                'Teh Botol 500ml',
            ]),
            'sku' => strtoupper($this->faker->bothify('TBS-###??')),
            'unit' => $this->faker->randomElement(['botol', 'kotak', 'dus']),
        ];
    }
}