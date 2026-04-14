<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

use App\Models\StockIn;
use App\Models\Product;
use App\Models\StockOut;
use Illuminate\Http\Request;
use App\Models\StockOutDetail;
use Illuminate\Support\Facades\DB;

class StockOutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StockOut::with(['product', 'details.batch']);

        if ($search = $request->search) {
            $query->whereHas("product", function ($query) use ($search) {
                $query->where("sku", "like", "%{$search}%")->orWhere('name', 'like', "%{$search}%");
            });
        }

        $stockouts = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("stockouts/index", [
            "stockouts" => $stockouts,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::with("batches")->latest()->get();
        return Inertia::render("stockouts/create", [
            "products" => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data_input = $request->validate([
            "product_id" => "required",
            "quantity" => "required",
            "out_date" => "required|date",
        ]);

        DB::beginTransaction();
        try {
            $batchs = StockIn::where('product_id', $data_input['product_id'])
                ->where('remaining_qty', '>', 0)
                ->orderBy('entry_date', 'asc')
                ->get();


            $totalAvailable = $batchs->sum('remaining_qty');
            if ($data_input['quantity'] > $totalAvailable) {
                return redirect()->back()->with('error', 'Stok tidak mencukupi. Sisa stok keseluruhan: ' . $totalAvailable);
            }

            $totalToTake = $data_input['quantity'];

            $stockOut = StockOut::create([
                'product_id' => $data_input['product_id'],
                'quantity' => $totalToTake,
                'out_date' => $data_input['out_date'],
            ]);

            foreach ($batchs as $batch) {
                if ($totalToTake <= 0) break;

                $take = min($batch->remaining_qty, $totalToTake);

                $available_qty = $batch->remaining_qty;

                // Update batch
                $batch->decrement('remaining_qty', $take);

                // Simpan detail
                StockOutDetail::create([
                    'stock_out_id' => $stockOut->id,
                    'available_qty' => $available_qty,
                    'stock_in_id' => $batch->id,
                    'quantity_used' => $take,
                    'qty_after_stockout' => $batch->remaining_qty,
                ]);

                $totalToTake -= $take;
            }

            DB::commit();

            return redirect()->route("stockouts.index")->with("success", "Data barang keluar berhasil ditambahkan.");
        } catch (\Throwable $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(StockOut $stockout)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockOut $stockout)
    {
        $products = Product::with("batches")->latest()->get();
        $stockout->load('product');
        return Inertia::render('stockouts/edit', [
            'stockout' => $stockout,
            'products' => $products
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockOut $stockout)
    {
        $data_input = $request->validate([
            "product_id" => "required",
            "quantity" => "required",
            "remaining_qty" => "required",
            "entry_date" => "required|date",
        ]);

        $stockout->update($data_input);

        return redirect()->route('stockouts.index')->with('success', 'Data barang keluar berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockOut $stockout)
    {
        $stockout->delete();

        return redirect()->route('stockouts.index')->with('success', 'Data barang keluar berhasil dihapus!');
    }
}
