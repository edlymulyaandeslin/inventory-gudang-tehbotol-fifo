<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\StockIn;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class StockInController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = StockIn::with('product');

        if ($search = $request->search) {
            $query->whereHas("product", function ($query) use ($search) {
                $query->where("sku", "like", "%{$search}%")->orWhere('name', 'like', "%{$search}%");
            });
        }

        $stockins = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("stockins/index", [
            "stockins" => $stockins,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::latest()->get();
        return Inertia::render("stockins/create", [
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
            "remaining_qty" => "required",
            "entry_date" => "required|date",
        ]);

        StockIn::create($data_input);

        return redirect()->route("stockins.index")->with("success", "Data barang masuk berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(StockIn $stockin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockIn $stockin)
    {
        $products = Product::latest()->get();
        $stockin->load('product');
        return Inertia::render('stockins/edit', [
            'stockin' => $stockin,
            'products' => $products
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockIn $stockin)
    {
        $data_input = $request->validate([
            "product_id" => "required",
            "quantity" => "required",
            "remaining_qty" => "required",
            "entry_date" => "required|date",
        ]);

        $stockin->update($data_input);

        return redirect()->route('stockins.index')->with('success', 'Data barang masuk berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockIn $stockin)
    {
        $stockin->delete();

        return redirect()->route('stockins.index')->with('success', 'Data barang masuk berhasil dihapus!');
    }
}