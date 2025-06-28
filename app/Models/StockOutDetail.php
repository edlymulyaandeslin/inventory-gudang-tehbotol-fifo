<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOutDetail extends Model
{
    /** @use HasFactory<\Database\Factories\StockOutDetailFactory> */
    use HasFactory;

    protected $guarded = [];

    public function stockOut()
    {
        return $this->belongsTo(StockOut::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}