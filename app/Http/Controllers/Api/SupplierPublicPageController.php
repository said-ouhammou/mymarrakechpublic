<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\SupplierPublicPage;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class SupplierPublicPageController extends Controller
{
    /**
     * Display the public page with activities (QR scan event)
     */
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

            // ✅ SMART QR SCAN TRACKING - Only count unique scans per visitor session
            $this->trackUniqueQRScan($qrCode->id, $request);
            
            // Track visitor information in visitor_tracking table
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
                ->where('b.is_active', 1)
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
                'qrCode' => $qrCode,
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

    /**
     * Show specific activity (view/click event)
     */
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

                // ✅ TRACK QR CODE VIEW + CLICK
                if ($activity) {
                    $this->updateQRCodeTracking($qrCode->id, 'view');
                    $this->updateQRCodeTracking($qrCode->id, 'click');
                    $this->trackVisitor($request, $page->slug, $qrCode->slug, 'activity_click', $activity->id, $activity->title);
                }

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

                // ✅ TRACK BANNER ACTIVITY CLICK (still updates QR code stats since accessed via QR)
                if ($activity) {
                    $this->updateQRCodeTracking($qrCode->id, 'click');
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
                'qrCode' => $qrCode,
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
     * ✅ SMART QR SCAN TRACKING - Only count unique scans per visitor session
     * This prevents counting navigation back to home page as new scans
     */
    private function trackUniqueQRScan($qrCodeId, Request $request)
    {
        try {
            $ipAddress = $this->getClientIpAddress($request);
            $userAgent = $request->header('User-Agent', '');
            
            // Create a unique visitor fingerprint (IP + User Agent)
            $visitorFingerprint = md5($ipAddress . $userAgent);
            
            // Check if we've already recorded a scan for this visitor today
            $today = now()->startOfDay();
            $existingScan = DB::connection('external')
                ->table('visitor_tracking')
                ->where('qr_code_id', $qrCodeId)
                ->where('ip_address', $ipAddress)
                ->where('action_type', 'qr_scan')
                ->where('created_at', '>=', $today)
                ->first();
            
            // Only count as new scan if this visitor hasn't scanned today
            if (!$existingScan) {
                $this->updateQRCodeTracking($qrCodeId, 'scan');
                \Log::info('New unique QR scan recorded', [
                    'qr_code_id' => $qrCodeId,
                    'ip_address' => $ipAddress,
                    'visitor_fingerprint' => $visitorFingerprint
                ]);
            } else {
                \Log::info('Duplicate QR scan ignored (same visitor, same day)', [
                    'qr_code_id' => $qrCodeId,
                    'ip_address' => $ipAddress,
                    'existing_scan_id' => $existingScan->id
                ]);
            }
            
        } catch (\Exception $e) {
            \Log::error('Failed to track unique QR scan', [
                'qr_code_id' => $qrCodeId,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * ✅ CENTRALIZED QR CODE TRACKING METHOD
     * Updates scan_count, view_count, click_count and last_scanned_at
     */
    private function updateQRCodeTracking($qrCodeId, $trackingType)
    {
        try {
            $updateData = ['last_scanned_at' => now()];
            
            switch ($trackingType) {
                case 'scan':
                    // Initial QR code scan (when first accessing the page via QR)
                    DB::connection('external')
                        ->table('supplier_qr_codes')
                        ->where('id', $qrCodeId)
                        ->increment('scan_count', 1, $updateData);
                    break;
                    
                case 'view':
                    // Activity detail view
                    DB::connection('external')
                        ->table('supplier_qr_codes')
                        ->where('id', $qrCodeId)
                        ->increment('view_count', 1, $updateData);
                    break;
                    
                case 'click':
                    // Activity click/interaction
                    DB::connection('external')
                        ->table('supplier_qr_codes')
                        ->where('id', $qrCodeId)
                        ->increment('click_count', 1, $updateData);
                    break;
            }
            
            \Log::info('QR Code tracking updated', [
                'qr_code_id' => $qrCodeId,
                'tracking_type' => $trackingType,
                'timestamp' => now()
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Failed to update QR code tracking', [
                'qr_code_id' => $qrCodeId,
                'tracking_type' => $trackingType,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Track visitor information in visitor_tracking table
     */
    private function trackVisitor(Request $request, $pageSlug, $qrCodeSlug = null, $actionType = 'page_view', $activityId = null, $activityTitle = null)
    {
        try {
            // Get client IP address
            $ipAddress = $this->getClientIpAddress($request);
            
            // Get location information
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
     * Track page view specifically (optional endpoint)
     */
    public function trackPageView(Request $request, $slug)
    {
        try {
            // Find QR code
            $qrCode = DB::connection('external')
                ->table('supplier_qr_codes')
                ->where('slug', $slug)
                ->first();

            if ($qrCode) {
                $this->updateQRCodeTracking($qrCode->id, 'view');
                $this->trackVisitor($request, $slug, $slug, 'page_view');
            }

            return response()->json(['status' => 'tracked']);
        } catch (\Exception $e) {
            \Log::error('Failed to track page view', [
                'slug' => $slug,
                'error' => $e->getMessage()
            ]);
            return response()->json(['status' => 'error'], 500);
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

        // If we're in development and got localhost IP, try to get the real public IP
        $requestIp = $request->ip();
        if (in_array($requestIp, ['127.0.0.1', '::1', 'localhost']) && app()->environment('local')) {
            return $this->getRealPublicIP();
        }

        return $requestIp;
    }

    /**
     * Get the real public IP address when in development
     */
    private function getRealPublicIP()
    {
        try {
            // Try multiple services to get public IP
            $services = [
                'https://api.ipify.org',
                'https://ipinfo.io/ip',
                'https://icanhazip.com',
                'https://checkip.amazonaws.com',
            ];

            foreach ($services as $service) {
                try {
                    $ch = curl_init();
                    curl_setopt($ch, CURLOPT_URL, $service);
                    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
                    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 3);
                    curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; IP-Checker)');
                    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                    
                    $ip = curl_exec($ch);
                    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                    curl_close($ch);
                    
                    if ($ip !== false && $httpCode === 200) {
                        $ip = trim($ip);
                        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                            return $ip;
                        }
                    }
                } catch (\Exception $e) {
                    // Continue to next service
                    continue;
                }
            }
        } catch (\Exception $e) {
            \Log::error('Failed to get real public IP', [
                'error' => $e->getMessage()
            ]);
        }

        // Fallback to localhost if all services fail
        return '127.0.0.1';
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
     * Get location information from IP address
     */
    private function getLocationFromIP($ipAddress)
    {
        try {
            // Skip location lookup for localhost/private IPs
            if (in_array($ipAddress, ['127.0.0.1', '::1', 'localhost']) || 
                !filter_var($ipAddress, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                return ['country' => 'Local', 'city' => 'Development'];
            }

            // Try multiple services in order of preference
            $services = [
                [
                    'url' => "http://ip-api.com/json/{$ipAddress}?fields=status,country,city",
                    'parser' => 'parseIpApi'
                ],
                [
                    'url' => "https://ipapi.co/{$ipAddress}/json/",
                    'parser' => 'parseIpApiCo'
                ],
                [
                    'url' => "http://ipinfo.io/{$ipAddress}/json",
                    'parser' => 'parseIpInfo'
                ]
            ];

            foreach ($services as $service) {
                try {
                    $locationData = $this->fetchLocationData($service['url'], $service['parser']);
                    if ($locationData && $locationData['country']) {
                        return $locationData;
                    }
                } catch (\Exception $e) {
                    continue;
                }
            }

            return ['country' => null, 'city' => null];

        } catch (\Exception $e) {
            \Log::error('Failed to get location from IP', [
                'ip' => $ipAddress,
                'error' => $e->getMessage()
            ]);
            return ['country' => null, 'city' => null];
        }
    }

    private function fetchLocationData($url, $parser)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; Location-Checker)');
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json'
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($response === false || $httpCode !== 200) {
            throw new \Exception("HTTP request failed: HTTP {$httpCode}, cURL error: {$error}");
        }
        
        $data = json_decode($response, true);
        if (!$data) {
            throw new \Exception("Invalid JSON response");
        }
        
        return $this->$parser($data);
    }

    /**
     * Parse ip-api.com response
     */
    private function parseIpApi($data)
    {
        if (!isset($data['status']) || $data['status'] !== 'success') {
            throw new \Exception('IP-API request failed: ' . ($data['message'] ?? 'Unknown error'));
        }
        
        return [
            'country' => $data['country'] ?? null,
            'city' => $data['city'] ?? null,
        ];
    }

    /**
     * Parse ipapi.co response
     */
    private function parseIpApiCo($data)
    {
        if (isset($data['error'])) {
            throw new \Exception('IPApi.co error: ' . $data['reason']);
        }
        
        return [
            'country' => $data['country_name'] ?? null,
            'city' => $data['city'] ?? null,
        ];
    }

    /**
     * Parse ipinfo.io response
     */
    private function parseIpInfo($data)
    {
        if (isset($data['bogon'])) {
            throw new \Exception('Private/bogon IP detected');
        }
        
        return [
            'country' => $data['country'] ?? null,
            'city' => $data['city'] ?? null,
        ];
    }
}