# Backend Fixes Required for Video Streaming

## Critical Issues

The frontend is now fully integrated with video playback, but the **Laravel backend needs urgent fixes** to enable proper streaming.

---

## 🔴 Issue #1: Raw Storage URLs Instead of Proxied Streaming Endpoints

### Current Behavior (BROKEN)
The backend is returning **raw filesystem storage URLs** like:
```
http://127.0.0.1/storage/public/videos/f0ZbJyts1XQBC0sIqbdLQw0pvcbZjMwZDh2VgL4h.mp4
```

This causes two critical errors:
1. **CORS Error**: No `Access-Control-Allow-Origin` header
2. **403 Forbidden**: Direct filesystem access blocked by permissions

### Expected Behavior (CORRECT)
The backend should return **proxied API URLs** like:
```
http://127.0.0.1/api/playback/hls/{token}/master.m3u8
```

---

## 📋 Required Backend Changes

### 1. Create Streaming Proxy Endpoint

**Route:** `GET /api/playback/hls/{token}/master.m3u8`

**Purpose:** Stream HLS manifest and video segments through authenticated endpoint

**Implementation:**
```php
// routes/api.php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/playback/hls/{token}/master.m3u8', [PlaybackController::class, 'streamHlsManifest']);
    Route::get('/playback/hls/{token}/{segment}', [PlaybackController::class, 'streamHlsSegment']);
});
```

**Controller Logic:**
```php
public function streamHlsManifest(Request $request, $token)
{
    // 1. Validate token
    $playbackToken = PlaybackToken::where('token', $token)
        ->where('expires_at', '>', now())
        ->firstOrFail();
    
    // 2. Get content file path
    $content = $playbackToken->contentItem;
    $videoAsset = $content->videoAssets()->where('quality', 'master')->first();
    
    if (!$videoAsset) {
        abort(404, 'Video not found');
    }
    
    // 3. Stream the file with proper headers
    $filePath = storage_path('app/' . $videoAsset->file_path);
    
    return response()->file($filePath, [
        'Content-Type' => 'application/vnd.apple.mpegurl',
        'Accept-Ranges' => 'bytes',
        'Access-Control-Allow-Origin' => env('FRONTEND_URL', 'http://localhost:3002'),
        'Access-Control-Allow-Methods' => 'GET, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, Authorization',
        'Cache-Control' => 'public, max-age=3600',
    ]);
}

public function streamHlsSegment(Request $request, $token, $segment)
{
    // Similar to above but for video segments (.ts files)
    // Validate token and stream the specific segment
}
```

---

### 2. Fix Playback Token Response

**Current Issue:** The `/api/playback/token` endpoint returns data with raw storage URLs

**Fix:** Return the HLS manifest URL instead:

```php
// PlaybackController.php
public function requestToken(Request $request)
{
    // ... existing validation and token creation ...
    
    return response()->json([
        'token' => $token->token,
        'expires_at' => $token->expires_at,
        'stream_url' => url("/api/playback/hls/{$token->token}/master.m3u8"), // ✅ Proxied URL
        'content_id' => $contentItem->id,
        'title' => $contentItem->title,
        'duration' => $contentItem->duration_seconds,
    ]);
}
```

---

### 3. Add CORS Middleware Configuration

**File:** `config/cors.php`

```php
return [
    'paths' => [
        'api/*',
        'playback/*', // Add playback routes
    ],
    
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3002'),
    ],
    
    'allowed_methods' => ['*'],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => ['Content-Range', 'Accept-Ranges'],
    
    'supports_credentials' => true,
];
```

---

### 4. Image Proxy Endpoint (Optional but Recommended)

**Route:** `GET /api/media/image/{path}`

**Purpose:** Serve images through authenticated endpoint with CORS headers

```php
Route::get('/media/image/{path}', [MediaController::class, 'serveImage'])
    ->where('path', '.*');

// Controller
public function serveImage(Request $request, $path)
{
    $filePath = storage_path('app/public/images/' . $path);
    
    if (!file_exists($filePath)) {
        abort(404);
    }
    
    return response()->file($filePath, [
        'Content-Type' => mime_content_type($filePath),
        'Access-Control-Allow-Origin' => env('FRONTEND_URL', 'http://localhost:3002'),
        'Cache-Control' => 'public, max-age=31536000',
    ]);
}
```

---

## 🎯 Testing Checklist

After implementing the fixes, test these scenarios:

### ✅ Video Playback
- [ ] Can request playback token
- [ ] HLS manifest loads without CORS errors
- [ ] Video segments stream without 403 errors
- [ ] Video plays smoothly in browser
- [ ] Can seek/skip through video
- [ ] Quality selection works (if applicable)

### ✅ Authentication
- [ ] Expired tokens are rejected
- [ ] Invalid tokens return 401
- [ ] Token validation works correctly

### ✅ Progress Tracking
- [ ] Progress updates save every 10 seconds
- [ ] Resume position loads correctly
- [ ] Final completion (100%) is recorded

### ✅ Images
- [ ] Poster images load correctly
- [ ] Thumbnail images load correctly
- [ ] No CORS errors on image requests

---

## 📝 Frontend Workarounds Applied

While waiting for backend fixes, the frontend has implemented these temporary workarounds:

1. **HLS URL Construction**: The frontend constructs the HLS manifest URL using:
   ```typescript
   const streamUrl = `${API_BASE_URL}/playback/hls/${token}/master.m3u8`
   ```

2. **Image URL Conversion**: The `getMediaUrl()` utility converts storage paths to backend URLs

3. **Poster URL Fixing**: VideoPlayer component converts poster paths to proper URLs

---

## 🚀 Expected Flow (After Fixes)

1. **User clicks Play** → Frontend requests playback token
2. **Backend validates** → Returns token + proxied HLS URL
3. **Frontend loads manifest** → Requests `GET /api/playback/hls/{token}/master.m3u8`
4. **Backend streams manifest** → Returns master.m3u8 with CORS headers
5. **Video.js parses manifest** → Requests video segments
6. **Backend streams segments** → Returns .ts files with CORS headers
7. **Video plays** → User watches seamlessly like Netflix!

---

## 📚 References

- [HLS Streaming Guide](https://developer.apple.com/documentation/http_live_streaming)
- [Laravel File Responses](https://laravel.com/docs/10.x/responses#file-downloads)
- [CORS Configuration](https://laravel.com/docs/10.x/routing#cors)
- [Byte-Range Requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests)

---

## ⚠️ Security Considerations

1. **Token Validation**: Always validate tokens before streaming
2. **Rate Limiting**: Implement rate limiting on streaming endpoints
3. **Content Access**: Verify user has access to the content
4. **DRM (Optional)**: Consider adding DRM for premium content
5. **Logging**: Log all playback requests for analytics

---

## 🆘 Need Help?

If you encounter issues implementing these fixes, check:
1. Laravel logs: `storage/logs/laravel.log`
2. Nginx/Apache error logs
3. Browser Network tab for exact error responses
4. Frontend console for CORS details

---

**Status:** 🔴 **URGENT - Blocking video playback functionality**

**Priority:** **P0 - Critical**

**Estimated Time:** 2-4 hours for experienced Laravel developer
