<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Batch;
use App\Models\StockOut;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $batch = Batch::with("product");
        $stockOut = StockOut::with("product");

        $new_barangmasuk = $batch->orderBy("entry_date", "desc")->limit(3)->get();
        $new_barangkeluar = $stockOut->orderBy("out_date", "desc")->limit(3)->get();

        $total_barangmasuk = $batch->sum('quantity');
        $total_barangkeluar = $stockOut->sum('quantity');
        $total_stok = $batch->sum('remaining_qty');

        return Inertia::render('dashboard', [
            'total_barangmasuk' => $total_barangmasuk,
            'total_barangkeluar' => $total_barangkeluar,
            'total_stok' => $total_stok,
            "new_barangmasuk" => $new_barangmasuk,
            "new_barangkeluar" => $new_barangkeluar,
        ]);
    }
}