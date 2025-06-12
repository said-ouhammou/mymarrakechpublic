<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\SupplierPublicPage;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class SupplierPublicPageController extends Controller
{

    public function index($slug)
    {
        $slug = request()->route('slug');

        $validator = Validator::make(['slug' => $slug], [
            'slug' => 'required|string|alpha_dash',
        ]);

        if ($validator->fails()) {
            abort(400, 'Invalid slug.');
        }

        try {
            $page = DB::connection('external')
            ->table('supplier_public_pages')
            ->whereRaw('JSON_SEARCH(multiple_qr_codes, "one", ?) IS NOT NULL', [$slug])
            ->where('is_active', 1)
            ->first();

            if (!$page) {
                abort(404, 'Page not found');
            }

            $bannerId = 1; // example banner ID
            // 1. Existing activities
            $activities = DB::connection('external')
                ->table('supplier_page_activities as spa')
                ->join('activities as a', 'spa.activity_id', '=', 'a.id')
                ->join('categories as c', 'a.category_id', '=', 'c.id')
                ->where('spa.page_id', $page->id)
                ->where('spa.is_visible', 1)
                ->select([
                    'a.id',
                    'a.supplier_id',
                    'a.category_id',
                    'a.title',
                    'a.description',
                    'a.payment_methods',
                    'a.localisation',
                    'a.image_path as image',
                    'spa.image_path',
                    'spa.rating',
                    'spa.person',
                    'spa.persons_number',
                    'spa.price',
                    'spa.discount',
                    'spa.discount_type',
                    'spa.display_order',
                    'spa.is_featured',
                    'c.title as category_title',
                    'c.description as category_description',
                ])
                ->orderBy('spa.display_order')
                ->get();

            $activityIds = $activities->pluck('id');

            // 2. Banner activities with detailed data (excluding already used activity IDs)
            $bannerActivities = DB::connection('external')
                ->table('banner_activities as ba')
                ->join('activities as a', 'ba.activity_id', '=', 'a.id')
                ->join('categories as c', 'a.category_id', '=', 'c.id')
                ->where('ba.banner_id', $bannerId)
                ->whereNotIn('a.id', $activityIds)
                ->select([
                    'a.id',
                    'a.supplier_id',
                    'a.category_id',
                    'a.title',
                    'a.description',
                    'a.payment_methods',
                    'a.localisation',
                    'a.image_path as image',
                    DB::raw('NULL as image_path'), // No spa data
                    DB::raw('NULL as rating'),
                    DB::raw('NULL as person'),
                    DB::raw('NULL as persons_number'),
                    DB::raw('NULL as price'),
                    DB::raw('NULL as discount'),
                    DB::raw('NULL as discount_type'),
                    DB::raw('NULL as display_order'),
                    DB::raw('NULL as is_featured'),
                    'c.title as category_title',
                    'c.description as category_description',
                ])
                ->get();

            $bannerActivityIds = $bannerActivities->pluck('id');

            // 3. Fetch schedules and prices for both sets
            $allActivityIds = $activityIds->merge($bannerActivityIds)->unique();

            $schedules = DB::connection('external')
                ->table('activity_schedules')
                ->whereIn('activity_id', $allActivityIds)
                ->get()
                ->groupBy('activity_id');

            $prices = DB::connection('external')
                ->table('activity_clients')
                ->whereIn('activity_id', $allActivityIds)
                ->select('activity_id', 'person', 'price', 'commission', 'commission_type_is_percentage')
                ->get()
                ->groupBy('activity_id');

            // 4. Map schedules and prices
            $activities = $activities->map(function ($activity) use ($schedules, $prices) {
                $activity->schedules = $schedules[$activity->id] ?? [];
                $activity->prices = $prices[$activity->id] ?? [];
                return $activity;
            });

            $bannerActivities = $bannerActivities->map(function ($activity) use ($schedules, $prices) {
                $activity->schedules = $schedules[$activity->id] ?? [];
                $activity->prices = $prices[$activity->id] ?? [];
                return $activity;
            });


            return response()->json([
                'page' => $page,
                'activities' => $activities,
                'bannerActivities' => $bannerActivities,
            ]);
        } catch (\Exception $e) {
            \Log::error('An error occurred while processing your request', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'An error occurred while processing your request',
            ], 500);
        }
    }


    public function show($slug, $id, $resourceType)
    {        
        $validator = Validator::make(['slug' => $slug, 'id' => $id, 'resourceType' => $resourceType], [
            'resourceType' => 'required|string|alpha_dash|max:3|in:qr,ban',
            'slug' => 'required|string|alpha_dash|max:255',
            'id' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid input parameters'], 400);
        }

        try {
            $activity = null;
            $page = null;

            
            $page = DB::connection('external')
            ->table('supplier_public_pages')
            ->whereRaw('JSON_SEARCH(multiple_qr_codes, "one", ?) IS NOT NULL', [$slug])
            ->where('is_active', 1)
            ->first();

            if (!$page) {
                return response()->json(['error' => 'Page not found'], 404);
            }

            if ($resourceType === "qr") {
                
                $activity = DB::connection('external')
                    ->table('supplier_page_activities as spa')
                    ->join('activities as a', 'spa.activity_id', '=', 'a.id')
                    ->join('categories as c', 'a.category_id', '=', 'c.id')
                    ->leftJoin('activity_clients as ac', 'a.id', '=', 'ac.activity_id')
                    ->where('spa.page_id', $page->id)
                    ->where('spa.activity_id', $id)
                    ->where('spa.is_visible', 1)
                    ->select([
                        'a.id',
                        'a.supplier_id',
                        'a.category_id',
                        'a.title',
                        'a.description',
                        'a.payment_methods',
                        'a.localisation',
                        'a.image_path as image',
                        'a.image_path',
                        'c.title as category_title',
                        'ac.price as price_amount',
                    ])
                    ->first();
            } else if ($resourceType === "ban") {
                
                $activity = DB::connection('external')
                ->table('banner_activities as ba')
                ->join('activities as a', 'ba.activity_id', '=', 'a.id')
                ->join('categories as c', 'a.category_id', '=', 'c.id')
                ->leftJoin('activity_clients as ac', 'a.id', '=', 'ac.activity_id')
                ->where('ba.banner_id', 1)
                ->where('ba.activity_id', $id)
                ->select([
                    'a.id',
                    'a.supplier_id',
                    'a.category_id',
                    'a.title',
                    'a.description',
                    'a.payment_methods',
                    'a.localisation',
                    'a.image_path as image',
                    'a.image_path',
                    'c.title as category_title',
                    'ac.price as price_amount',
                ])
                ->first();
            }

            if (!$activity) {
                return response()->json(['error' => 'Activity not found in banner'], 404);
            }

            // Common part: fetch schedules and prices
            $schedules = DB::connection('external')
                ->table('activity_schedules')
                ->where('activity_id', $id)
                ->get();

            $prices = DB::connection('external')
                ->table('activity_clients')
                ->where('activity_id', $id)
                ->get();

            // Attach schedules and prices
            $activity->schedules = $schedules;
            $activity->prices = $prices;

            return response()->json([
                'page' => $page,
                'activity' => $activity,
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in activity show', ['message' => $e->getMessage()]);
            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }

}
