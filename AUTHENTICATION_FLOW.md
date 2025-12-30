/**
 * =============================================================================
 * Authentication Flow Implementation for Spring Boot Backend
 * =============================================================================
 * 
 * PROBLEM:
 * - Frontend (client-side) couldn't send authentication tokens to Spring Boot
 * - Spring Security required JWT tokens for all requests (except OPTIONS)
 * - Client-side fetch requests were being rejected with 401 Unauthorized
 * 
 * SOLUTION:
 * - Use Next.js API Routes (server-side) as a proxy between frontend and backend
 * - baseApiRequest.ts handles token management server-side (safer, centralized)
 * - Frontend calls server-side route (no auth needed), route calls backend with token
 * 
 * =============================================================================
 * FLOW DIAGRAM
 * =============================================================================
 *
 * BEFORE (❌ Fails - No Auth):
 * 
 *   Client Browser                    Spring Boot Backend
 *   ├─ fetch("/api/children", {      
 *   │  POST payload
 *   └──────────────────────────────> ❌ 401 Unauthorized (no token)
 * 
 * 
 * AFTER (✅ Works - Server-Side Auth):
 * 
 *   Client Browser          Next.js API Route           Spring Boot Backend
 *   │                       (Server-Side)               │
 *   ├─ fetch("/api/children", {     │
 *   │  POST payload        │
 *   └──────────────────────────────>│  (uses baseApiRequest)
 *                          │         │  ├─ getValidAccessToken()
 *                          │         │  ├─ Attach: Authorization Bearer <token>
 *                          │         │  ├─ POST to http://localhost:8080/api/children
 *                          │         └─────────────────────────────────>✅ 201 Created
 *                          │                           │
 *                          │<──────────────────────────┘
 *                          │ (returns response)
 *   <──────────────────────┤
 *   (displays success)      │
 * 
 * 
 * =============================================================================
 * FILES MODIFIED
 * =============================================================================
 * 
 * 1. app/api/children/route.ts (NEW)
 *    - Server-side API route that proxies requests to Spring Boot
 *    - Uses baseApiRequest to automatically attach auth tokens
 *    - Endpoint: POST/GET /api/children
 * 
 * 2. app/dashboard/parent/page.tsx (UPDATED)
 *    - Changed API_ENDPOINT from "http://localhost:3001/api/children"
 *      to "/api/children" (Next.js API route)
 *    - Updated handleAddChild() with defensive JSON parsing
 *    - Better error handling for empty response bodies
 * 
 * 3. app/utils/apiRequests/baseApiRequest.ts (ALREADY EXISTS)
 *    - Server-side utility that manages tokens securely
 *    - Fetches access token from cookies
 *    - Attaches Authorization: Bearer <token> header
 *    - This is now being used by the new API route
 * 
 * 
 * =============================================================================
 * HOW IT WORKS - STEP BY STEP
 * =============================================================================
 * 
 * CREATING A CHILD:
 * 
 * 1. User fills form on parent page (client-side)
 * 2. Form submits to handleAddChild()
 * 3. fetch("/api/children", { POST, payload })
 *    └─ Calls NEXT.JS API ROUTE (server-side)
 * 
 * 4. Inside app/api/children/route.ts:
 *    └─ POST handler receives the request
 *    └─ Calls baseApiRequest() with token handling
 *    └─ baseApiRequest():
 *       ├─ Calls getValidAccessToken() to retrieve JWT from cookies
 *       ├─ Adds header: Authorization: Bearer <token>
 *       ├─ Calls fetch("http://localhost:8080/api/children", {POST})
 *       └─ Returns response to client
 * 
 * 5. Spring Boot receives authenticated request
 *    ├─ Security filter validates JWT token ✅
 *    ├─ ChildController.createChild() executes
 *    └─ Returns JSON with created child data
 * 
 * 6. Client receives response
 *    ├─ Parses JSON (defensively)
 *    ├─ Updates UI with new child
 *    └─ Shows success toast
 * 
 * 
 * FETCHING CHILDREN:
 * 
 * Same flow but for GET request:
 * 
 * 1. useEffect() calls fetchChildren()
 * 2. fetch("/api/children", { GET })
 *    └─ Calls NEXT.JS API ROUTE (server-side)
 * 3. API route uses baseApiRequest() with token
 * 4. Spring Boot returns { children: [...] }
 * 5. Client parses and renders list
 * 
 * 
 * =============================================================================
 * ENVIRONMENT SETUP
 * =============================================================================
 * 
 * Required environment variables in .env.local:
 * 
 * NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api
 * (This tells the API route where the Spring Boot backend is running)
 * 
 * Token management happens automatically via:
 * - Session cookie (stores refresh token)
 * - getValidAccessToken() in baseApiRequest.ts
 * 
 * 
 * =============================================================================
 * SECURITY BENEFITS
 * =============================================================================
 * 
 * ✅ Tokens never exposed to client JavaScript
 * ✅ Token refresh handled server-side
 * ✅ Backend sees requests from trusted server origin
 * ✅ No CORS issues (Next.js and Backend on same origin from client POV)
 * ✅ Centralized auth logic in baseApiRequest.ts
 * ✅ Easy to add logging/monitoring on proxy layer
 * 
 * 
 * =============================================================================
 * NEXT STEPS / WHAT TO DO NOW
 * =============================================================================
 * 
 * 1. Make sure .env.local has:
 *    NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api
 * 
 * 2. Ensure Spring Boot is running:
 *    cd backend/zyberhero-server
 *    mvn spring-boot:run
 *    (Should be accessible at http://localhost:8080)
 * 
 * 3. Start Next.js frontend:
 *    npm run dev
 *    (Should be on http://localhost:3000)
 * 
 * 4. Test the flow:
 *    - Navigate to Parent Dashboard
 *    - Try adding a child
 *    - Should see success message (no "Unexpected end of JSON input" error)
 *    - Child should appear in list after fetch
 * 
 * 
 * =============================================================================
 * TROUBLESHOOTING
 * =============================================================================
 * 
 * If you still get "Failed to fetch children data":
 * 
 * 1. Check if Spring Boot is running on port 8080
 *    curl http://localhost:8080/api/children
 *    Should return 401 (requires auth) or 200 with data
 * 
 * 2. Check if tokens are being retrieved properly
 *    Look at browser console for errors in parent/page.tsx
 * 
 * 3. Check Network tab in DevTools:
 *    POST /api/children (should be 201, not 401)
 * 
 * 4. Check server logs:
 *    Both Next.js (npm run dev) and Spring Boot (mvn spring-boot:run)
 * 
 * 
 * =============================================================================
 * CODE EXAMPLES FOR OTHER ENDPOINTS
 * =============================================================================
 * 
 * If you need to create similar routes for other endpoints (devices, activity, etc):
 * 
 * Pattern is the same - create app/api/[resource]/route.ts:
 * 
 * ┌─ app/api/devices/route.ts
 * │
 * ├─ export async function POST(request)
 * │  └─ baseApiRequest(BACKEND_URL/devices, {POST}, {isAccessTokenRequird: true})
 * │
 * └─ export async function GET()
 *    └─ baseApiRequest(BACKEND_URL/devices, {GET}, {isAccessTokenRequird: true})
 * 
 * Then in client components:
 * 
 * ┌─ const API_ENDPOINT = "/api/devices"
 * │
 * ├─ fetch(API_ENDPOINT, {POST, body})
 * │
 * └─ All auth handled automatically!
 * 
 */
