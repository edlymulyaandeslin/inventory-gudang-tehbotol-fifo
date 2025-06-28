<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with("batches");

        if ($search = $request->search) {
            $query->where("sku", "like", "%{$search}%")->orWhere('name', 'like', "%{$search}%");
        }

        $products = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render("products/index", [
            "products" => $products,
            "search" => $request->search
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("products/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data_input = $request->validate([
            "name" => "required",
            "unit" => "required",
            'image' => 'nullable|image|max:2048'
        ]);

        $data_input['sku'] = strtoupper(fake()->bothify('TBS-###??'));

        if ($request->hasFile('image')) {
            $file = $request->file('image');

            // Buat nama file unik: uuid + ekstensi asli
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            // Simpan file ke storage/app/public/products/
            $file->storeAs('products', $filename, 'public');

            // Tambahkan ke data yang akan disimpan ke DB
            $data_input['image'] = 'products/' . $filename;
        }

        Product::create($data_input);

        return redirect()->route("products.index")->with("success", "Product berhasil ditambahkan.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        return Inertia::render('products/edit', [
            'product' => $product,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        // dd($request->all());
        $validate_data = $request->validate([
            "name" => "required",
            "unit" => "required",
            'image' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('image')) {
            if ($product->image && Storage::exists($product->image)) {
                Storage::delete($product->image);
            }

            $file = $request->file('image');

            // Buat nama file unik: uuid + ekstensi asli
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();

            // Simpan file ke storage/app/public/products/
            $file->storeAs('products', $filename, 'public');

            // Tambahkan ke data yang akan disimpan ke DB
            $validate_data['image'] = 'products/' . $filename;
        } else {
            $validate_data['image'] = $product->image;
        }

        $product->update($validate_data);

        return redirect()->route('products.index')->with('success', 'Product berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        // Hapus file gambar jika ada
        if ($product->image && Storage::exists($product->image)) {
            Storage::delete($product->image);
        }

        // Hapus data produk dari database
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product berhasil dihapus!');
    }
}