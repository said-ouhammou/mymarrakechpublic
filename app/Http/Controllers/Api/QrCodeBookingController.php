<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class QrCodeBookingController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'adults' => 'required|integer|min:0',
            'children' => 'required|integer|min:0',
            'withTransfer' => 'required|boolean',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'date' => 'required|date',
            'activity_id' => 'required|integer',
            'supplier_id' => 'required|integer',
            'category_id' => 'required|integer',
            'activity_title' => 'nullable|string|max:255',
            'category_title' => 'nullable|string|max:255',
            'total_price' => 'required|numeric',
            'source' => 'nullable|string|max:255',
            'source_id' => 'nullable|integer',
            'base_url' => 'nullable|url|max:255',
        ]);

        // Using the external database connection
        $booking = DB::connection('external')->table('qr_code_bookings')->insert([
            'firstName' => $validated['firstName'], // Corrected to match column names
            'lastName' => $validated['lastName'], // Corrected to match column names
            'adults' => $validated['adults'],
            'children' => $validated['children'],
            'withTransfer' => $validated['withTransfer'], // Corrected to match column names
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'date' => $validated['date'],
            'activity_id' => $validated['activity_id'],
            'supplier_id' => $validated['supplier_id'],
            'category_id' => $validated['category_id'],
            'activity_title' => $validated['activity_title'] ?? null,
            'category_title' => $validated['category_title'] ?? null,
            'total_price' => $validated['total_price'],
            'source' => $validated['source'] ?? null,
            'source_id' => $validated['source_id'] ?? null,
            'base_url' => $validated['base_url'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        

        if ($booking) {
            return response()->json([
                'message' => 'Booking successfully stored in the external DB.',
                'booking' => $validated,  // Optionally return the validated data
            ], 201);
        }

        return response()->json(['message' => 'Failed to store booking in external DB.'], 500);
    }
}
