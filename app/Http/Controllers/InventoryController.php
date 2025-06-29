<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;

class InventoryController extends Controller
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

        return Inertia::render("inventories/index", [
            "products" => $products,
            "search" => $request->search
        ]);
    }
}