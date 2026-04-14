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
<<<<<<< HEAD
        return $this->belongsTo(Batch::class);
=======
        return $this->belongsTo(StockIn::class, 'stock_in_id');
>>>>>>> 9e5cce2 (fix: fix bug in stockoutcontroller)
    }
}