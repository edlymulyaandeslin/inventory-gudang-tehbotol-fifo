<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $guarded = [];

    public function batches()
    {
        return $this->hasMany(Batch::class);
    }

    public function stockOuts()
    {
        return $this->hasMany(StockOut::class);
    }
}