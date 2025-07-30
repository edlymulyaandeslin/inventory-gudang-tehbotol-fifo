<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockIn extends Model
{
    /** @use HasFactory<\Database\Factories\StockInFactory> */
    use HasFactory;
    protected $guarded = [];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function stockOutDetails()
    {
        return $this->hasMany(StockOutDetail::class);
    }
}