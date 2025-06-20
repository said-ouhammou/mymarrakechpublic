<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\SupplierPublicPage;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class SupplierPublicPageController extends Controller
{
    public function index($slug, Request $request)
    {
        $validator = Validator::make(['slug' => $slug], [
            'slug' => 'required|string|alpha_dash',
        ]);

        if ($validator->fails()) {
            abort(400, 'Invalid slug.');
        }

        try {
            // First find the QR code record
            $qrCode = DB::connection('external')
                ->table('supplier_qr_codes')
                ->where('slug', $slug)
                ->first();

            if (!$qrCode) {
                abort(404, 'QR code not found');
            }

            // Then get the associated page
            $page = DB::connection('external')
                ->table('supplier_public_pages')
                ->where('id', $qrCode->page_id)
                ->where('is_active', 1)
                ->first();

            if (!$page) {
                abort(404, 'Page not found or inactive');
            }

            // Track visitor information
            $this->trackVisitor($request, $page->slug, $qrCode->slug, 'qr_scan');
            
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
                ->join('banners as b', 'b.id', '=', 'ba.banner_id')
                ->where('b.is_active',1 )
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

            // Update QR code scan count
            DB::connection('external')
                ->table('supplier_qr_codes')
                ->where('id', $qrCode->id)
                ->increment('scan_count');

            $bannerMetaData = DB::connection('external')
                ->table('banners as b')
                ->select('b.title', 'b.description')
                ->where('b.is_active', 1)
                ->first();

            return response()->json([
                'page' => $page,
                'activities' => $activities,
                'bannerActivities' => $bannerActivities,
                'bannerMetaData' => $bannerMetaData,
                'qrCode' => $qrCode, // Optional: include QR code info if needed
            ]);
        } catch (\Exception $e) {
            \Log::error('An error occurred while processing your request', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'An error occurred while processing your request',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function showOLD($slug, $id, $resourceType)
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

    public function show($slug, $id, $resourceType, Request $request)
    {
        $validator = Validator::make([
            'slug' => $slug, 
            'id' => $id, 
            'resourceType' => $resourceType
        ], [
            'resourceType' => 'required|string|alpha_dash|max:3|in:qr,ban',
            'slug' => 'required|string|alpha_dash|max:255',
            'id' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Invalid input parameters'], 400);
        }

        try {
            // First find the QR code record
            $qrCode = DB::connection('external')
                ->table('supplier_qr_codes')
                ->where('slug', $slug)
                ->first();

            if (!$qrCode) {
                return response()->json(['error' => 'QR code not found'], 404);
            }

            // Then get the associated page
            $page = DB::connection('external')
                ->table('supplier_public_pages')
                ->where('id', $qrCode->page_id)
                ->where('is_active', 1)
                ->first();

            if (!$page) {
                return response()->json(['error' => 'Page not found or inactive'], 404);
            }

            $activity = null;

            if ($resourceType === "qr") {
                // Get activity from page activities
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
                        'spa.image_path',
                        'c.title as category_title',
                        'ac.price as price_amount',
                    ])
                    ->first();

                // Track activity click for QR code
                if ($activity) {
                    $this->trackVisitor($request, $page->slug, $qrCode->slug, 'activity_click', $activity->id, $activity->title);
                }

                // Track QR code view
                DB::connection('external')
                    ->table('supplier_qr_codes')
                    ->where('id', $qrCode->id)
                    ->increment('view_count');

            } elseif ($resourceType === "ban") {
                // Get activity from banner activities
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

                // Track activity click for banner
                if ($activity) {
                    $this->trackVisitor($request, $page->slug, $qrCode->slug, 'activity_click', $activity->id, $activity->title);
                }
            }

            if (!$activity) {
                return response()->json([
                    'error' => $resourceType === 'qr' 
                        ? 'Activity not found in page' 
                        : 'Activity not found in banner'
                ], 404);
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
                'qrCode' => $qrCode, // Optional: include QR code info
            ]);

        } catch (\Exception $e) {
            \Log::error('Error in activity show', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'slug' => $slug,
                'id' => $id,
                'resourceType' => $resourceType
            ]);

            return response()->json([
                'error' => 'An error occurred while processing your request',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Track visitor information
     */
    private function trackVisitor(Request $request, $pageSlug, $qrCodeSlug = null, $actionType = 'page_view', $activityId = null, $activityTitle = null)
    {
        try {
            // Get client IP address
            $ipAddress = $this->getClientIpAddress($request);
            
            // Get location information (you might want to use a service like GeoIP)
            $locationData = $this->getLocationFromIP($ipAddress);
            
            // Get device and browser information
            $userAgent = $request->header('User-Agent');
            $deviceInfo = $this->parseUserAgent($userAgent);

            // Get page and QR code IDs for reference
            $pageId = null;
            $qrCodeId = null;

            // Get page ID
            $page = DB::connection('external')
                ->table('supplier_public_pages')
                ->where('slug', $pageSlug)
                ->first();
            if ($page) {
                $pageId = $page->id;
            }

            // Get QR code ID if provided
            if ($qrCodeSlug) {
                $qrCode = DB::connection('external')
                    ->table('supplier_qr_codes')
                    ->where('slug', $qrCodeSlug)
                    ->first();
                if ($qrCode) {
                    $qrCodeId = $qrCode->id;
                }
            }

            // Insert tracking data
            DB::connection('external')
                ->table('visitor_tracking')
                ->insert([
                    'supplier_page_id' => $pageId,
                    'supplier_page_slug' => $pageSlug,
                    'qr_code_id' => $qrCodeId,
                    'qr_code_slug' => $qrCodeSlug,
                    'ip_address' => $ipAddress,
                    'country' => $locationData['country'] ?? null,
                    'city' => $locationData['city'] ?? null,
                    'device_type' => $deviceInfo['device_type'] ?? null,
                    'browser' => $deviceInfo['browser'] ?? null,
                    'action_type' => $actionType,
                    'activity_id' => $activityId,
                    'activity_title' => $activityTitle,
                    'created_at' => now(),
                ]);

        } catch (\Exception $e) {
            // Log the error but don't break the main functionality
            \Log::error('Failed to track visitor', [
                'error' => $e->getMessage(),
                'page_slug' => $pageSlug,
                'qr_code_slug' => $qrCodeSlug,
                'action_type' => $actionType
            ]);
        }
    }

    /**
     * Get the real client IP address
     */
    private function getClientIpAddress(Request $request)
    {
        $ipKeys = [
            'HTTP_CF_CONNECTING_IP',     // Cloudflare
            'HTTP_CLIENT_IP',            // Proxy
            'HTTP_X_FORWARDED_FOR',      // Load Balancer/Proxy
            'HTTP_X_FORWARDED',          // Proxy
            'HTTP_X_CLUSTER_CLIENT_IP',  // Cluster
            'HTTP_FORWARDED_FOR',        // Proxy
            'HTTP_FORWARDED',            // Proxy
            'REMOTE_ADDR'                // Standard
        ];

        foreach ($ipKeys as $key) {
            if (array_key_exists($key, $_SERVER) === true) {
                $ip = $_SERVER[$key];
                if (strpos($ip, ',') !== false) {
                    $ip = explode(',', $ip)[0];
                }
                $ip = trim($ip);
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }

        return $request->ip();
    }

    /**
     * Get location information from IP address
     * You can integrate with services like GeoIP2, IPinfo, or ipapi
     */
    private function getLocationFromIP($ipAddress)
    {
        try {
            // Example using ipapi.co (free tier available)
            // You should replace this with your preferred GeoIP service
            $response = file_get_contents("https://ipapi.co/{$ipAddress}/json/");
            $data = json_decode($response, true);
            
            if ($data && !isset($data['error'])) {
                return [
                    'country' => $data['country_name'] ?? null,
                    'city' => $data['city'] ?? null,
                ];
            }
        } catch (\Exception $e) {
            \Log::error('Failed to get location from IP', [
                'ip' => $ipAddress,
                'error' => $e->getMessage()
            ]);
        }

        return ['country' => null, 'city' => null];
    }

    /**
     * Parse user agent to extract device and browser information
     */
    private function parseUserAgent($userAgent)
    {
        $deviceType = 'Desktop';
        $browser = 'Unknown';

        if (!$userAgent) {
            return ['device_type' => $deviceType, 'browser' => $browser];
        }

        // Detect device type
        if (preg_match('/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i', $userAgent)) {
            if (preg_match('/iPad/i', $userAgent)) {
                $deviceType = 'Tablet';
            } else {
                $deviceType = 'Mobile';
            }
        }

        // Detect browser
        if (preg_match('/Chrome/i', $userAgent) && !preg_match('/Edge/i', $userAgent)) {
            $browser = 'Chrome';
        } elseif (preg_match('/Firefox/i', $userAgent)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Safari/i', $userAgent) && !preg_match('/Chrome/i', $userAgent)) {
            $browser = 'Safari';
        } elseif (preg_match('/Edge/i', $userAgent)) {
            $browser = 'Edge';
        } elseif (preg_match('/Opera/i', $userAgent)) {
            $browser = 'Opera';
        } elseif (preg_match('/MSIE|Trident/i', $userAgent)) {
            $browser = 'Internet Explorer';
        }

        return [
            'device_type' => $deviceType,
            'browser' => $browser
        ];
    }

    /**
     * Track page view specifically
     */
    public function trackPageView(Request $request, $slug)
    {
        $this->trackVisitor($request, $slug, null, 'page_view');
        return response()->json(['status' => 'tracked']);
    }
}