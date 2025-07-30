<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Batch;
use App\Models\StockIn;
use App\Models\StockOut;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $stockin = StockIn::with("product");
        $stockOut = StockOut::with("product");

        $new_barangmasuk = $stockin->orderBy("entry_date", "desc")->limit(3)->get();
        $new_barangkeluar = $stockOut->orderBy("out_date", "desc")->limit(3)->get();

        $total_barangmasuk = $stockin->sum('quantity');
        $total_barangkeluar = $stockOut->sum('quantity');
        $total_stok = $stockin->sum('remaining_qty');

        return Inertia::render('dashboard', [
            'total_barangmasuk' => $total_barangmasuk,
            'total_barangkeluar' => $total_barangkeluar,
            'total_stok' => $total_stok,
            "new_barangmasuk" => $new_barangmasuk,
            "new_barangkeluar" => $new_barangkeluar,
        ]);
    }
}