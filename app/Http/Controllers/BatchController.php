<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Batch;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;

class BatchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Batch::with('product');

        if ($search = $request->search) {
            $query->whereHas("product", function ($query) use ($search) {
                $query->where("sku", "like", "%{$search}%")->orWhere('name', 'like', "%{$search}%");
            });
        }

        $batchs = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("batchs/index", [
            "batchs" => $batchs,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $products = Product::latest()->get();
        return Inertia::render("batchs/create", [
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

        Batch::create($data_input);

        return redirect()->route("batchs.index")->with("success", "Data barang masuk berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Batch $batch)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Batch $batch)
    {
        $products = Product::latest()->get();
        $batch->load('product');
        return Inertia::render('batchs/edit', [
            'batch' => $batch,
            'products' => $products
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Batch $batch)
    {
        $data_input = $request->validate([
            "product_id" => "required",
            "quantity" => "required",
            "remaining_qty" => "required",
            "entry_date" => "required|date",
        ]);

        $batch->update($data_input);

        return redirect()->route('batchs.index')->with('success', 'Data barang masuk berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Batch $batch)
    {
        $batch->delete();

        return redirect()->route('batchs.index')->with('success', 'Data barang masuk berhasil dihapus!');
    }
}