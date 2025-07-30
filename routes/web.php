<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockInController;
use App\Http\Controllers\StockOutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource("users", UserController::class);
    Route::resource("products", ProductController::class);
    Route::resource("stockins", StockInController::class);
    Route::resource("stockouts", StockOutController::class);
    Route::get("inventories", [InventoryController::class, 'index'])->name('inventories.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';