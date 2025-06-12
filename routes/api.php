<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\QrCodeBookingController;
use App\Http\Controllers\Api\SupplierPublicPageController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/{slug}', [SupplierPublicPageController::class, 'index']);
Route::get('/{slug}/{id}/{resourceType}', [SupplierPublicPageController::class, 'show']);
Route::post('/bookings', [QrCodeBookingController::class, 'store']);
