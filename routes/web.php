<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BatchController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StockOutController;
use App\Http\Controllers\InventoryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource("users", UserController::class);
    Route::resource("products", ProductController::class);
    Route::resource("batchs", BatchController::class);
    Route::resource("stockouts", StockOutController::class);
    Route::get("inventories", [InventoryController::class, 'index'])->name('inventories.index');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';