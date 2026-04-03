# Vissar Security Report

**Date:** 2026-04-02T07:45:00Z
**Auditor:** Ghost (Pass 1 — Opus)
**Project:** Vissar Dashboard (Next.js + Upstash Redis + Stripe + NextAuth)
**Routes audited:** 24 API routes + middleware + config

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 5 |
| ⚠️ HIGH | 6 |
| 🟡 MEDIUM | 4 |
| ℹ️ LOW | 3 |

**Verdict: 🔴 BLOCK LAUNCH** — Critical vulnerabilities must be fixed first.

---

## 🔴 CRITICAL Issues

### C1: Debug Routes Expose Production Info
**Files:** `app/api/debug/env/route.ts`, `app/api/debug/stripe/route.ts`
**Risk:** Anyone can hit `/api/debug/stripe` and see the first 12 characters of your Stripe secret key, plus your price IDs. `/api/debug/env` reveals Redis configuration status.
**Fix:** **DELETE both files immediately.** They should never exist in production. If needed for dev, gate behind `NODE_ENV === 'development'` AND admin auth.

### C2: Stripe Secret Key Prefix Leaked
**File:** `app/api/debug/stripe/route.ts` line 6
**Code:** `const keyPrefix = process.env.STRIPE_SECRET_KEY?.substring(0, 12) || 'MISSING';`
**Risk:** Reveals key type (sk_live_ vs sk_test_) and partial key. Combined with other info, increases attack surface.
**Fix:** Delete the route (see C1).

### C3: CORS Wildcard on Track & Widget Routes
**Files:** `app/api/track/route.ts`, `app/api/widget/[id]/reviews/route.ts`, `app/api/widget/[id]/highlights/route.ts`
**Code:** `'Access-Control-Allow-Origin': '*'`
**Risk:** Any website can call your tracking API and widget endpoints. An attacker could inflate analytics, drain API quota, or scrape all widget data.
**Fix for track:** Rate limit by IP (already partially done). For widgets: CORS `*` is somewhat expected for embeddable widgets, but add domain validation from widget config (only allow the domain the widget is configured for).

### C4: Admin Set-Plan Uses Shared Secret (No Rate Limiting)
**File:** `app/api/admin/set-plan/route.ts`
**Code:** `if (secret !== process.env.ADMIN_SECRET)` — uses a static string comparison
**Risk:** Brute-forceable — no rate limiting on this endpoint. If ADMIN_SECRET is weak, anyone can set any user to any plan. Also vulnerable to timing attacks (string comparison leaks length info).
**Fix:** 
1. Add rate limiting (max 3 attempts per minute)
2. Use `crypto.timingSafeEqual()` instead of `!==`
3. Better: Replace with proper admin auth (NextAuth admin role check)

### C5: Plan Upgrade Route Has Authorization Bypass
**File:** `app/api/user/plan/route.ts` POST handler
**Code:** `const targetEmail = email || session.user.email;` — A logged-in user can pass ANY email and change THEIR plan.
**Risk:** User A can upgrade User B to pro, or downgrade them to free. There's no check that the requesting user is modifying their own plan.
**Fix:** Remove the `email` parameter. Users can only modify their own plan: `const targetEmail = session.user.email;`
Or: Require admin auth to modify another user's plan.

---

## ⚠️ HIGH Issues

### H1: No Middleware — Zero Route Protection
**File:** `middleware.ts` — **DOES NOT EXIST**
**Risk:** Every route relies on its own auth check. If a developer forgets `getServerSession()` on a new route, it's open to the world.
**Fix:** Create `middleware.ts` with NextAuth session validation. Protect all `/api/*` and `/dashboard/*` routes. Whitelist public routes (`/api/track`, `/api/widget/[id]/reviews`, `/api/webhook`).

### H2: Widget Endpoints Have No Auth or Ownership Check
**Files:** `app/api/widget/[id]/route.ts` (GET and DELETE), `app/api/analytics/widget/route.ts`
**Risk:** 
- `GET /api/widget/[id]` — Anyone with a widget ID can read full widget config
- `DELETE /api/widget/[id]` — **Anyone can delete any widget** — no auth check at all
- `GET /api/analytics/widget?id=X` — Anyone can read any widget's analytics
**Fix:** Add auth checks. DELETE must verify the requesting user owns the widget.

### H3: No Security Headers
**File:** `next.config.mjs`
**Risk:** Missing X-Frame-Options (clickjacking), CSP (XSS), HSTS (downgrade attacks), X-Content-Type-Options (MIME sniffing).
**Fix:** Add headers block to next.config.mjs (see security-gate references/owasp-top10-api.md for config).

### H4: No Rate Limiting on Most Routes
**Finding:** Only 5 of 24 routes have any rate limiting. Checkout, admin, places search, analytics, and all user routes are unprotected.
**Risk:** API abuse, credential stuffing on admin endpoint, cost inflation on Google Places API calls.
**Fix:** Add Upstash rate limiting middleware (already have Redis set up — just need to apply it).

### H5: JWT Tokens in .env Files Committed
**Files:** `.env.production`, `.env.local`
**Risk:** Vercel OIDC tokens committed to disk. If repo goes public or is accessed, tokens are exposed.
**Fix:** Add `.env.production` to `.gitignore`. Rotate the tokens. Use Vercel's environment variable UI, not files.

### H6: Usage Route Has No Auth
**File:** `app/api/usage/route.ts`
**Risk:** Anyone can query `/api/usage?widgetId=X` for any widget. Reveals usage patterns and plan tiers.
**Fix:** Add auth check, or at minimum validate the requester owns the widget.

---

## 🟡 MEDIUM Issues

### M1: Error Messages Leak Internal Details
**Multiple files** return `error.message` in responses:
- `app/api/widget/route.ts`: `return NextResponse.json({ error: msg })`
- `app/api/widget/[id]/reviews/route.ts`: `details: error instanceof Error ? error.message : String(error)`
**Fix:** Return generic errors to client. Log details server-side only.

### M2: Places Search Has No Auth or Rate Limiting
**File:** `app/api/places/search/route.ts`
**Risk:** Anyone can call this to make Google Places API requests on your dime. No auth, no rate limit.
**Fix:** Add auth + rate limiting. This burns your Google API quota.

### M3: Checkout Route Has No Auth
**File:** `app/api/checkout/route.ts`
**Risk:** Anyone can create checkout sessions by providing arbitrary userId/email. While Stripe handles the actual payment securely, this could be used for phishing or session enumeration.
**Fix:** Require NextAuth session. Use session email, not client-provided email.

### M4: In-Memory Usage Store Won't Survive Restarts
**File:** `app/api/usage/route.ts` — `const usageStore = new Map();`
**Risk:** Not a security issue per se, but usage tracking resets on every deploy/restart, meaning view limits don't work.
**Fix:** Use Redis (already have Upstash) instead of in-memory Map.

---

## ℹ️ LOW Issues

### L1: `dangerouslySetInnerHTML` Check
**Finding:** Not found — ✅ Clean

### L2: Webhook Signature Verification
**File:** `app/api/webhook/route.ts`
**Finding:** ✅ Properly uses `stripe.webhooks.constructEvent()` with webhook secret. Well implemented.

### L3: NextAuth Configuration
**Finding:** Auth is present via NextAuth with proper session handling. Issue is it's not consistently applied to all routes.

---

## Priority Fix Order

1. **DELETE debug routes** (C1/C2) — 30 seconds
2. **Fix plan upgrade bypass** (C5) — 5 minutes
3. **Create middleware.ts** (H1) — 30 minutes
4. **Add auth to widget DELETE and analytics** (H2) — 20 minutes
5. **Fix admin endpoint** (C4) — 15 minutes
6. **Add security headers** (H3) — 10 minutes
7. **Add rate limiting to remaining routes** (H4) — 1 hour
8. **Fix CORS on track endpoint** (C3) — 15 minutes
9. **Remove JWT tokens from env files** (H5) — 10 minutes
10. **Fix error message leaks** (M1) — 20 minutes

**Estimated total fix time:** 3-4 hours for a developer

---

## Pass 1 Verdict (Opus)

**🔴 BLOCK LAUNCH.** 5 critical + 6 high issues. The debug routes and plan bypass are immediately exploitable. Widget deletion without auth means any user (or bot) can wipe anyone's widgets.

**Pass 2 (GPT-5.4):** PENDING

---

---

## Pass 2 Review (Sonnet)

**Date:** 2026-04-02T08:10:00Z  
**Auditor:** Cortex (Pass 2 — Sonnet)  
**Scope:** Full independent review of all 24 API routes + lib/auth.ts, lib/db.ts, lib/stripe.ts, lib/plans.ts, next.config.mjs  
**Method:** Read every route file cold, then cross-checked against Pass 1 findings.

---

### New Findings (Missed by Pass 1)

#### N1: 🔴 CRITICAL — `/api/widget` GET Exposes ALL Widgets to Unauthenticated Callers (BOLA)
**File:** `app/api/widget/route.ts` — GET handler  
**Code:**
```ts
const filtered = userId ? widgets.filter(w => w.userId === userId || !w.userId) : widgets;
```
**Issue:** When no session exists, `userId` is `null/undefined` (falsy). The ternary takes the `else` branch and returns **the entire widget array** — every user's widgets, unfiltered. Complete BOLA (Broken Object Level Authorization) exposure.  
**Bonus issue:** Even when authenticated, `!w.userId` returns orphaned widgets to every logged-in user, leaking data from deleted/corrupted records.  
**Fix:** Require auth. Return only `w.userId === userId`. Reject unauthenticated callers with 401.

---

#### N2: 🔴 CRITICAL — Mass Assignment in Widget Creation — Free Users Get Business Features
**File:** `app/api/widget/route.ts` — POST handler  
**Code:**
```ts
const body = await request.json();
const widget = await saveWidget({ ...body, userId });
```
**Issue:** The entire request body is spread directly into `saveWidget()`. An unauthenticated (or free-tier) user can POST:
```json
{ "tier": "business", "removeBranding": true, "customCss": ".badge { display: none }", "template": "premium" }
```
...and get a widget saved with business-tier properties without paying. The `userId` override is the only thing appended after the spread, so all other fields are attacker-controlled. This completely bypasses plan enforcement at the widget config level.  
**Fix:** Whitelist allowed fields in POST. Pull `tier` from the authenticated user's actual plan, never from request body.

---

#### N3: ⚠️ HIGH — `/api/widget` DELETE Has No Auth Check
**File:** `app/api/widget/route.ts` — DELETE handler  
**Code:**
```ts
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  // ...no auth check...
  const success = await deleteWidget(id);
```
**Issue:** No `getServerSession()` call. Any anonymous caller can `DELETE /api/widget?id=<any_widget_id>`. Pass 1 caught unauthenticated DELETE on `/api/widget/[id]` (H2) but missed this second unprotected DELETE on the collection route.  
**Fix:** Add auth check. Verify the authenticated user owns the widget before deletion.

---

#### N4: ⚠️ HIGH — API Key Generation is Predictable; `ADMIN_SECRET` Dual-Use Creates Cascading Compromise
**File:** `app/api/user/api-key/route.ts`  
**Code:**
```ts
const salt = process.env.ADMIN_SECRET || 'vissar-default-salt';
const hash = createHash('sha256').update(session.user.email + salt).digest('hex');
const apiKey = `vsk_${hash.slice(0, 32)}`;
```
**Two separate issues:**
1. **Default salt hardcoded:** If `ADMIN_SECRET` is not set in the environment, the salt is the literal string `'vissar-default-salt'`. Anyone who knows this (public code) can pre-compute API keys for any known user email. SHA-256 is fast — no key stretching, no randomness.
2. **Dual-use secret:** `ADMIN_SECRET` is used as *both* (a) admin authentication for `set-plan` and (b) the salt for every user's API key. Brute-forcing the admin endpoint (already flagged as C4) doesn't just get admin access — it also lets the attacker derive API keys for any user whose email is known.  
**Fix:** Generate API keys with `crypto.randomBytes(32)` and store them in Redis per-user. Separate secrets: admin auth key and API key salt should be different env vars (or ideally, API keys should be random, not derived).

---

#### N5: 🟡 MEDIUM — Custom Domain Stored Without Validation — Stored XSS Vector
**File:** `app/api/user/custom-domain/route.ts` — POST handler  
**Code:**
```ts
const { domain } = body;
// ...no validation...
await redis.set(`customDomain:${session.user.email}`, domain || '');
return NextResponse.json({ success: true, domain });
```
**Issue:** Arbitrary string accepted and stored. If the domain value is displayed anywhere in the dashboard without proper escaping (e.g., rendered via `innerHTML` or in email templates), this is stored XSS. No format validation means values like `"><script>alert(1)</script>` can be stored. Also: no URL scheme check, so `javascript:...` payloads could be stored for use in `href` attributes.  
**Fix:** Validate domain format on server (regex for `^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`). Strip protocol/path. Sanitize before render.

---

#### N6: 🟡 MEDIUM — Widget POST Allows Unauthenticated Widget Creation
**File:** `app/api/widget/route.ts` — POST handler  
**Code:**
```ts
const session = await getServerSession(authOptions);
const userId = (session?.user as { id?: string })?.id || session?.user?.email;
// No auth rejection — creates widget with undefined userId if no session
const widget = await saveWidget({ ...body, userId });
```
**Issue:** If `userId` is `undefined`, the widget is saved with no owner. Coupled with N1 (unauthenticated GET returns orphaned widgets), an anonymous attacker can flood the database with widgets that appear in all authenticated users' sidebar. This is also a storage DoS vector.  
**Fix:** Reject POST with 401 if no session.

---

#### N7: 🟡 MEDIUM — `.env.production` Not in `.gitignore` — OIDC Token Commit Risk
**File:** `.gitignore`  
**Issue:** The gitignore excludes `.env*.local` and the explicit `.env.prod`, but **not** `.env.production`. The `.env.production` file on disk contains a live Vercel OIDC JWT token (confirmed in file). If the repository is committed to git (locally or pushed to GitHub), this token ships with the repo.  
**Pass 1 noted H5** about JWT tokens in env files but didn't flag the gitignore gap specifically — making this a concrete escalation path.  
**Fix:** Add `.env.production` and `.env.vercel.*` to `.gitignore` immediately. Rotate the OIDC token.

---

#### N8: 🟡 MEDIUM — Unauthenticated Track Endpoint Allows Analytics Inflation for Any Widget
**File:** `app/api/track/route.ts`  
**Issue:** The track endpoint accepts any `widgetId` and increments Redis counters without validating the widget exists or that the caller is related to it. Pass 1 noted CORS-wildcard (C3) but didn't flag the analytics manipulation angle: an attacker can inflate competitors' view counts (inflating plan usage, potentially tripping view limits), or zero-in on denial-of-service by triggering view limits for free-tier users.  
**Also:** The `widgetId` is embedded in Redis keys like `analytics:${widgetId}:views` with no sanitization. A `widgetId` containing `:` could collide with other key namespaces.  
**Fix:** Validate widgetId exists in DB before incrementing. Sanitize widgetId to alphanumeric + underscores only.

---

#### N9: ℹ️ LOW — Webhook `resolvePlan()` Has Insecure Default — Any Unknown Plan Becomes "pro"
**File:** `app/api/webhook/route.ts`  
**Code:**
```ts
function resolvePlan(metadata): string {
  const planId = metadata?.planId;
  if (planId === "business" || planId === "pro") return planId;
  return "pro";  // default fallback
}
```
**Issue:** If Stripe sends a webhook with `metadata.planId = "free"` or any unrecognized value, the user gets upgraded to "pro" instead. This is an insecure default. A Stripe configuration error (setting metadata incorrectly) would silently grant all users pro access.  
**Fix:** Return `"free"` as default, or throw on unrecognized plan IDs.

---

### Pass 1 Findings — Verification

| ID | Status | Notes |
|----|--------|-------|
| **C1** | ✅ CONFIRMED | Both debug routes confirmed open, no auth, no env gating. Delete immediately. |
| **C2** | ✅ CONFIRMED | `substring(0, 12)` on STRIPE_SECRET_KEY confirmed in code — reveals `sk_live_` prefix. |
| **C3** | ✅ CONFIRMED | `'Access-Control-Allow-Origin': '*'` on track, widget/reviews, widget/highlights, and `/api/reviews`. |
| **C4** | ✅ CONFIRMED + UPGRADED | Plain `!==` string comparison confirmed. No rate limiting confirmed. **Additionally:** `ADMIN_SECRET` is also used as the API key salt (N4 above) — brute-forcing admin is now worth even more. Severity should be upgraded from HIGH to CRITICAL given the dual-use. |
| **C5** | ✅ CONFIRMED | `const targetEmail = email || session.user.email;` confirmed in `user/plan/route.ts`. Any logged-in user can change any user's plan. |
| **H1** | ✅ CONFIRMED | `middleware.ts` does not exist. Verified via filesystem check. |
| **H2** | ✅ CONFIRMED + EXTENDED | `widget/[id]/route.ts` GET and DELETE both have zero auth. Pass 2 also found the collection-level `GET /api/widget` and `DELETE /api/widget` are ALSO unprotected (N1, N3 above). The scope of unprotected widget operations is larger than Pass 1 identified. |
| **H3** | ✅ CONFIRMED | `next.config.mjs` is 4 lines, no `headers()` function. No CSP, no HSTS, no X-Frame-Options. |
| **H4** | ✅ CONFIRMED | Only track route has rate limiting. Analytics, checkout, places, all user routes, all widget routes — no rate limiting. |
| **H5** | ✅ CONFIRMED + UPGRADED | Verified OIDC JWT present in `.env.production`. **Critical gap:** `.env.production` is NOT excluded by `.gitignore` (only `.env*.local` and `.env.prod` are excluded). Token is at active git-commit risk, not just "file on disk" risk. Severity upgrade warranted. |
| **H6** | ✅ CONFIRMED | `usage/route.ts` has no `getServerSession()` call. Any caller can query usage for any widgetId. |
| **M1** | ✅ CONFIRMED | `widget/[id]/reviews/route.ts` error handler: `details: error instanceof Error ? error.message : String(error)` — leaks to public CORS endpoint. |
| **M2** | ✅ CONFIRMED | `places/search/route.ts` has zero auth. No rate limiting. Burns Google API quota for anonymous callers. |
| **M3** | ✅ CONFIRMED | `checkout/route.ts` takes `{ planId, userId, email }` from request body with no session check. |
| **M4** | ✅ CONFIRMED | `const usageStore = new Map()` at module level in `usage/route.ts`. Confirmed in-memory only. |

---

### Pass 2 Verdict

**🔴 BLOCK LAUNCH**

Pass 1 correctly called this. Pass 2 finds 3 additional critical/high issues that reinforce the verdict:

- **N1** means any unauthenticated bot can scrape every customer's widget configuration (placeId, business info, plan tier) right now
- **N2** means free users can self-upgrade to business features by setting `tier: "business"` in widget creation — revenue model is bypassed before the product ships
- **N3** is a second unauthenticated DELETE path (complementing H2) — widgets can be mass-deleted anonymously

**Minimum viable fix list before launch (revised):**

| Priority | Fix | Time |
|----------|-----|------|
| 1 | Delete debug routes (C1/C2) | 1 min |
| 2 | Add auth + ownership check to ALL widget routes (N1, N2, N3, H2) | 45 min |
| 3 | Fix mass assignment — whitelist POST fields, enforce tier from session (N2) | 30 min |
| 4 | Fix plan bypass (C5) — remove `email` param from user/plan POST | 5 min |
| 5 | Fix API key generation — use random bytes, not derived hash (N4) | 20 min |
| 6 | Add `.env.production` to `.gitignore`, rotate OIDC token (N7/H5) | 5 min |
| 7 | Create `middleware.ts` for baseline auth (H1) | 30 min |
| 8 | Add security headers to next.config.mjs (H3) | 10 min |
| 9 | Fix webhook resolvePlan default (N9) | 2 min |
| 10 | Add rate limiting to admin + places + checkout (C4/M2/M3) | 1 hr |
| 11 | Validate/sanitize custom domain input (N5) | 10 min |
| 12 | Validate widgetId in track endpoint (N8) | 10 min |

**Estimated total:** ~4 hours for a competent developer.

**Pass 2 Confidence:** High. All findings derived from direct code reading. No gray areas — the unauthenticated widget exposure (N1), mass assignment (N2), and predictable API key derivation (N4) are unambiguous exploits.

---

## Pass 2 Review (GPT-5.4)

### New Findings (missed by Pass 1)

#### G1: 🔴 CRITICAL — Widget POST is an unauthenticated upsert, so attackers can overwrite other users’ widgets by ID
**Files:** `app/api/widget/route.ts`, `lib/db.ts`

**Why this matters:**
- `POST /api/widget` does **not** require auth.
- The request body is passed straight into `saveWidget({ ...body, userId })`.
- `saveWidget()` treats a supplied `id` as authoritative and performs an **update-or-create**:
  - if `widget.id` already exists, it replaces the existing widget.

**Exploit path:**
1. Call unauthenticated `GET /api/widget` to dump all widgets and IDs.
2. Re-POST one of those IDs with attacker-controlled fields.
3. Victim widget is silently overwritten.

This is stronger than generic mass assignment: it is a direct BOLA/IDOR write primitive against all widget records.

**Fix:**
- Require auth on `POST /api/widget`.
- On create, ignore client-supplied `id`.
- On update, use a separate authenticated route and verify ownership before saving.
- In `saveWidget()`, do not allow blind overwrite by arbitrary ID.

#### G2: ⚠️ HIGH — Plan enforcement is client-controlled across widget APIs
**Files:** `app/api/widget/route.ts`, `lib/db.ts`, `app/api/widget/[id]/reviews/route.ts`

**Why this matters:**
- Widget creation accepts attacker-controlled fields like `tier`, `removeBranding`, `customCss`, `template`, etc.
- Widget rendering later trusts stored widget flags and returns premium/business presentation settings from the widget record.
- The code does fetch the user’s plan in `widget/[id]/reviews`, but it still returns attacker-controlled premium fields such as `removeBranding`, `customCss`, advanced display flags, and template choices.

So a free/anonymous user can persist premium config and have the public widget endpoint honor much of it. This is a business-logic authorization failure, not just bad input hygiene.

**Fix:**
- Derive feature flags server-side from the authenticated account plan.
- Whitelist only safe editable fields.
- Reject premium-only fields unless the stored owner plan actually allows them.

#### G3: 🟡 MEDIUM — Account deletion leaves user records behind, enabling stale-account data retention
**File:** `app/api/user/settings/route.ts`

**Why this matters:**
- `DELETE /api/user/settings` removes widgets, plan hash entry, notifications, and custom domain.
- It does **not** delete the actual user record from `users` storage.

This is not an auth bypass, but it is a security/privacy flaw: deleted accounts are only partially deleted, leaving stale PII (`email`, `name`, timestamps) behind.

**Fix:**
- Add user-record deletion to the account deletion flow.
- If retention is intentional, document it and mark the account as deleted/anonymized.

### Pass 1 Findings — Verification

- **C1 — CONFIRMED**
  - `app/api/debug/env/route.ts` and `app/api/debug/stripe/route.ts` are publicly reachable and expose operational secrets/state. Still launch-blocking.

- **C2 — CONFIRMED**
  - Stripe secret prefix leakage is real. Agree with critical because it is an avoidable secret disclosure on a public route.

- **C3 — CHALLENGED / DOWNGRADED**
  - The wildcard CORS headers are present.
  - But `Access-Control-Allow-Origin: *` is **not itself** a critical vulnerability on intentionally public embed endpoints. CORS is not access control.
  - The real issues are lack of auth/ownership checks and missing abuse controls. I would downgrade this finding to **LOW/INFO** unless sensitive authenticated data is later exposed cross-origin.

- **C4 — CONFIRMED**
  - Shared-secret admin auth with no rate limiting is real.
  - I also agree severity is effectively critical in practice because compromise gives direct plan-control over all users.

- **C5 — CONFIRMED**
  - `targetEmail = email || session.user.email` is a straight privilege-escalation flaw.

- **H1 — CHALLENGED / DOWNGRADED**
  - No `middleware.ts` is true.
  - But absence of middleware is not a vulnerability by itself; it is an architectural weakness that increases future risk.
  - I would rate this **MEDIUM** as defense-in-depth, not HIGH.

- **H2 — CONFIRMED**
  - Unauthenticated widget read/delete exposure is real.
  - I would expand it further: collection-level widget routes are also vulnerable, not just `[id]` routes.

- **H3 — CHALLENGED / DOWNGRADED**
  - Missing security headers are real, but in this codebase they are not among the top launch blockers.
  - I would rate this **MEDIUM** unless there is confirmed framing/XSS risk that depends on those headers.

- **H4 — CONFIRMED**
  - Most routes lack rate limiting. This materially increases brute-force, abuse, and cost-exhaustion risk.

- **H5 — CONFIRMED**
  - `.env.production` contains a live-looking Vercel OIDC token and is not ignored by `.gitignore`.
  - This is serious and operationally dangerous. I agree it should block launch until rotated/removed.

- **H6 — CONFIRMED**
  - `/api/usage` has no auth and exposes per-widget usage/tier data.

- **M1 — CONFIRMED**
  - Internal error text is exposed in multiple endpoints, including public widget routes.

- **M2 — CONFIRMED**
  - `/api/places/search` is unauthenticated and unthrottled. Real quota-burn risk.

- **M3 — CONFIRMED**
  - `/api/checkout` trusts caller-supplied `planId`, `userId`, and `email` with no session binding.

- **M4 — CONFIRMED**
  - In-memory usage tracking resets on restart/deploy and undermines enforcement logic.
  - I agree this is mostly integrity/business-logic impact, not a direct security exploit.

### Pass 2 Verdict

**BLOCK LAUNCH**

Core reasons:
- Public debug routes still expose secret-bearing operational data.
- Widget APIs currently allow unauthenticated read, delete, create, and even overwrite behavior.
- Plan changes and API-key logic have clear authorization and secret-management flaws.
- A committed OIDC token in `.env.production` is an immediate remediation item.

**Most important delta from prior reviews:** the biggest missed issue is **G1** — `POST /api/widget` is not just mass assignment, it is an unauthenticated arbitrary overwrite primitive for any widget ID.

---

## Post-Rebuild Audit — Pass 2 (GPT-5.4)
### Findings

#### 1. CRITICAL — Authenticated users can self-upgrade to paid tiers without paying
- **File:** `app/api/user/plan/route.ts`
- **Issue:** `POST /api/user/plan` lets any authenticated user set their own plan to `pro` or `business` directly:
  - accepts `{ plan }` from client
  - writes it via `setUserPlan()`
  - no Stripe/payment/admin verification
- **Impact:** straight privilege escalation and revenue bypass. This also unlocks downstream gated features such as API key issuance and custom domains, because those endpoints trust the stored plan.
- **Why it matters post-rebuild:** ownership is fixed now, but authorization is still wrong. The endpoint no longer lets users change *other* users’ plans; it still lets them grant themselves paid access.

#### 2. HIGH — Live Vercel OIDC tokens are present in env files on disk
- **Files:** `.env.local`, `.env.production`
- **Issue:** both files contain live-looking `VERCEL_OIDC_TOKEN` JWTs.
- **Impact:** if these files were ever committed, copied, synced, or exposed through backups/logs, they provide bearer-token style infrastructure access. Even if `.gitignore` now excludes them, the tokens should be treated as compromised and rotated.
- **Note:** `.gitignore` does include `.env*.local`, `.env.production`, and `.env.vercel.*`, so the current ignore rules are better than Pass 1. The risk is the secret material itself already existing in project files.

#### 3. MEDIUM — No CSP/HSTS; current headers are only partial hardening
- **File:** `next.config.mjs`
- **Issue:** rebuild added useful headers (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`), but there is still:
  - no `Content-Security-Policy`
  - no `Strict-Transport-Security`
  - legacy `X-XSS-Protection` header, which is obsolete and should not be relied on
- **Impact:** not an auth bypass by itself, but still below a strong production baseline for a SaaS dashboard with authenticated surfaces and public embeds.

#### 4. MEDIUM — Rate limiting fails open on Redis outage/misconfiguration
- **File:** `lib/ratelimit.ts`
- **Issue:** when Redis is unavailable or errors, `checkRateLimit()` returns `{ allowed: true }`.
- **Affected sensitive routes:** `app/api/admin/set-plan/route.ts`, `app/api/checkout/route.ts`, `app/api/places/search/route.ts`, `app/api/user/api-key/route.ts`
- **Impact:** brute-force and abuse protections disappear exactly when infrastructure is degraded. For `admin/set-plan`, this weakens the shared-secret control significantly.

#### 5. MEDIUM — Database layer lacks enum/check constraints for security-sensitive fields
- **Files:** `lib/db/schema/users.ts`, `lib/db/schema/widgets.ts`
- **Issue:** fields such as `users.plan` and `widgets.layout` are plain `text`, and `widgets.config` is unconstrained `jsonb`.
- **Impact:** route-level Zod validation is good, but the DB does not enforce allowed values. Any future internal script, admin tool, migration, or missed route validator can write invalid/privileged state directly.
- **Security angle:** this increases blast radius for mass-assignment or privilege bugs and weakens defense in depth.

#### 6. LOW — Public review/embed endpoints remain intentionally public and wildcard-CORS, but abuse controls are thin
- **Files:** `app/api/track/route.ts`, `app/api/widget/[id]/reviews/route.ts`, `app/api/widget/[id]/highlights/route.ts`
- **Issue:** this appears intentional for embeddable widgets, and current input validation is materially better than before. Still, these endpoints:
  - allow cross-origin access from anywhere
  - do not bind requests to approved embed domains
  - rely on basic validation rather than origin/domain authorization
- **Impact:** mostly analytics inflation / scraping / quota abuse risk, not a direct auth bypass in the rebuilt code.

### Pass 1 Cross-Check
- **Agree:** the rebuild fixed a lot of the Pass 1 launch blockers:
  - middleware now exists and covers `/dashboard/*` and `/api/*`
  - widget CRUD routes now enforce auth + ownership checks
  - analytics/widget and usage routes now verify ownership
  - admin set-plan now has validation, rate limiting, and timing-safe comparison
  - security headers are partially present
  - `.gitignore` now covers `.env.production`
- **Disagree / downgrade:** several Pass 1 issues are no longer current in the rebuilt codebase, especially the unauthenticated widget deletion/read paths and missing middleware claim.
- **Still agree on substance:** launch should still be blocked, but for a narrower reason set now.
- **Biggest remaining blocker after rebuild:** `POST /api/user/plan` is still a privilege-escalation endpoint. That is the one issue I would treat as immediate stop-ship.

### Verdict
**BLOCK**

Reasons:
- **Stop-ship:** authenticated self-upgrade to `pro`/`business` in `app/api/user/plan/route.ts`
- **Must remediate before production confidence:** rotate/remove the exposed Vercel OIDC tokens from env files; tighten header baseline; decide whether rate limiting should fail closed or at least hard-fail on the admin route

If the self-upgrade route is removed or restricted to verified billing/admin flows, and the OIDC tokens are rotated, this rebuild is much closer to launch-ready than Pass 1 was.

---


---

## Post-Rebuild Audit — Pass 1 (Sonnet)

**Date:** 2026-04-02T21:14:00Z  
**Auditor:** Subagent (Sonnet) — fresh cold read, independent of prior reports  
**Scope:** All 20 API route files, middleware.ts, lib/services/*, lib/db/schema/*, lib/validators/*, lib/auth.ts, lib/ratelimit.ts, lib/plans.ts, next.config.mjs, .gitignore, .env files  
**Context:** Rebuild replaced Redis-as-DB with PostgreSQL + Drizzle, added Zod validation, service layer, middleware, rate limiting, and security headers.

---

### Findings

#### What the Rebuild Fixed (Prior Issues Now Resolved)

| Prior Issue | Status |
|-------------|--------|
| Middleware missing (H1) | FIXED — middleware.ts covers /dashboard/* and /api/* |
| Widget routes unauthenticated (H2) | FIXED — all widget CRUD checks session + ownership |
| Admin set-plan no rate limit (C4) | FIXED — 3/min rate limit + timingSafeEqual |
| Security headers missing (H3) | FIXED — X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy added |
| Widget DELETE unauthenticated | FIXED — both /api/widget and /api/widget/[id] check auth + ownership |
| Analytics widget ownership | FIXED — ownership check in analytics/widget route |
| Usage route unauthenticated | FIXED — auth + ownership check added |
| API key predictable hash (N4) | FIXED — now uses randomBytes(32) |
| Webhook resolvePlan bad default (N9) | FIXED — defaults to "free" |
| .gitignore missing .env.production | FIXED — .env.production now in gitignore |
| Plan POST lets user change anyone's plan (C5) | FIXED — targetEmail = session.user.email hardcoded |
| Debug routes (C1/C2) | CONFIRMED GONE — no debug routes in rebuilt source |

**12 of ~15 prior stop-ship issues are resolved. Major improvement.**

---

#### R1: CRITICAL — Self-Upgrade to Pro/Business Without Paying

**File:** app/api/user/plan/route.ts (POST handler)

Any authenticated user can POST { "plan": "pro" } and immediately receive a pro plan with no payment verification. This grants:
- API key access (gated on plan === 'pro' || 'business')
- Custom domain access (same gate)
- 10,000 view limit (vs 200 free)

No Stripe, no webhook, no admin check. The prior C5 fix only prevented changing *other* users' plans. This is users upgrading *themselves*.

**Fix:** Remove the POST handler or restrict it to admin-only. Plan writes should only come from /api/webhook (Stripe) or /api/admin/set-plan. Never from a self-serve authenticated endpoint.

---

#### R2: HIGH — customCss and removeBranding Returned Without Plan Check on Public Widget Endpoint

**File:** app/api/widget/[id]/reviews/route.ts (lines 58, 76)

These fields are read directly from the config JSONB column and returned to the public CORS-wildcard endpoint:
```
removeBranding: cfg.removeBranding ?? false,
customCss: cfg.customCss ?? null,
```

The write validators correctly exclude these fields, but the *read path* has no plan-tier gating. If these values exist in config (via admin tool, direct DB write, or future migration), the public widget endpoint serves them regardless of the owner's actual plan.

**Fix:** Before returning removeBranding/customCss, check the widget owner's plan. Only serve these values if tier === 'pro' || 'business'.

---

#### R3: HIGH — widget.userId Used as Email for Plan Lookup — All Widgets Get Free Tier

**File:** app/api/widget/[id]/reviews/route.ts (line 45)

```
const userEmail = widget.userId;
const plan = await getUserPlanAsync(userEmail);
```

widget.userId is the Google OAuth subject ID (e.g. "107..."), not an email. getUserPlanAsync() keys on email. These will never match, so every widget lookup returns plan = 'free' regardless of what the owner paid for.

Effect: all tier-gated behavior (viewLimit, branding, feature flags) is silently wrong for paid users.

**Fix:** Look up the widget owner's email from the users table before calling getUserPlanAsync. Or store email on the widget record at creation time.

---

#### R4: HIGH — Rate Limiting Fails Open on Redis Outage

**File:** lib/ratelimit.ts

Both the "Redis not configured" path and the error catch path return { allowed: true }:
```
if (!redis) {
  return { allowed: true, remaining: maxRequests };
}
// ...
} catch (error) {
  return { allowed: true, remaining: maxRequests };
}
```

This affects admin/set-plan, checkout, API key generation, and places search. Brute-force protection disappears silently during any Redis degradation.

**Fix:** For security-critical routes (admin, checkout), fail closed — return 503 if rate limiting cannot be verified. Add alerting when rate limiting is bypassed.

---

#### R5: MEDIUM — /api/reviews Public Endpoint Has No Auth, Rate Limiting, or placeId Validation

**File:** app/api/reviews/route.ts

placeId from query params is passed to fetchFromGoogle() and used as a Redis cache key (reviews:${placeId}). No format validation, no auth, no rate limiting. Any external caller can trigger unlimited Google Places API requests. A malformed placeId with colons could create Redis key namespace collisions.

**Fix:** Validate placeId format (Google Place IDs are alphanumeric, ~27+ chars, start with ChIJ). Add rate limiting per IP. Consider requiring auth.

---

#### R6: MEDIUM — /api/track Doesn't Verify Widget Exists — Analytics Inflation Attack

**File:** app/api/track/route.ts

The Zod validator checks widgetId format but doesn't verify the widget exists. Attackers can inflate any widget's view counts. For free-tier users, this could exhaust the 200-view monthly limit — a targeted denial-of-service against specific users.

**Fix:** Add a DB existence check for widgetId before incrementing Redis counters. Cache result briefly to avoid overhead.

---

#### R7: MEDIUM — users.plan Has No DB-Level Constraint

**File:** lib/db/schema/users.ts

```
plan: text('plan').notNull().default('free'),
```

Only Zod/route-level validation enforces allowed values. A direct DB insert, migration script, or admin tool could write "premium" or "superadmin" and break === comparisons silently throughout the codebase.

**Fix:** Add a PostgreSQL check constraint via Drizzle to enforce ('free', 'pro', 'business').

---

#### R8: MEDIUM — Missing CSP and HSTS; Deprecated XSS-Protection Header Present

**File:** next.config.mjs

Present: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-XSS-Protection.
Missing: Content-Security-Policy, Strict-Transport-Security.
Note: X-XSS-Protection is a deprecated header. Modern browsers ignore it; it can create vulnerabilities in old IE. Should be removed.

**Fix:** Add CSP and HSTS. Remove X-XSS-Protection.

---

#### R9: LOW — Live OIDC Tokens in Env Files Currently Tracked by Git

**Files:** .env.production, .env.vercel.debug, .env.local

.gitignore now correctly excludes these files, but git ls-files confirms .env.production is currently tracked. Any git history traversal exposes the tokens.

**Fix:** Run git rm --cached .env.production .env.vercel.debug to untrack. Rotate all three OIDC tokens. Audit git history.

---

#### R10: LOW — Error Detail Leak on Public Widget Endpoint

**File:** app/api/widget/[id]/reviews/route.ts

```
{ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) }
```

Internal error messages are returned in JSON to any caller on this public CORS endpoint.

**Fix:** Return only { error: 'Internal server error' }. Log details server-side.

---

### Summary Table

| ID | Severity | Issue |
|----|----------|-------|
| R1 | CRITICAL | Self-upgrade to pro/business without paying via POST /api/user/plan |
| R2 | HIGH | customCss/removeBranding served without plan check on public widget route |
| R3 | HIGH | Widget reviews uses userId (not email) for plan lookup — all widgets get free tier |
| R4 | HIGH | Rate limiting fails open on Redis outage — admin/checkout unprotected during degradation |
| R5 | MEDIUM | /api/reviews: no placeId validation, no auth, no rate limit, burns Google quota |
| R6 | MEDIUM | /api/track doesn't verify widget exists — analytics inflation + usage exhaustion |
| R7 | MEDIUM | users.plan has no DB check constraint |
| R8 | MEDIUM | Missing CSP and HSTS; deprecated XSS-Protection header present |
| R9 | LOW | Live OIDC tokens in git-tracked env files |
| R10 | LOW | Error detail leak on public widget endpoint |

**Prior issues fixed by rebuild: 12 of ~15**

---

### Verdict

**BLOCK — But Close**

The rebuild eliminated the worst issues. The codebase is materially stronger: middleware exists, widget ownership is enforced, admin endpoint is hardened, debug routes are gone, API keys use random bytes.

**The one stop-ship blocker is R1:** any logged-in user can self-upgrade to pro/business by posting { "plan": "pro" }. This bypasses Stripe entirely and grants access to paid features. Cannot ship with this route accepting user-controlled plan upgrades.

**R3 is also practically blocking:** all paid users' widgets are served as free-tier because of the userId/email mismatch. The plan enforcement is broken at the read path.

**Fix order before launch:**
1. R1 (CRITICAL): Remove or restrict POST /api/user/plan — 5 min
2. R3 (HIGH): Fix plan lookup in widget reviews to use email not userId — 15 min
3. R9 (LOW but time-sensitive): Untrack env files from git, rotate OIDC tokens — 10 min
4. R2 (HIGH): Gate customCss/removeBranding on owner plan — 20 min
5. R4 (HIGH): Fail closed on rate limit check for admin/checkout — 30 min
6. R5/R6 (MEDIUM): Validate placeId; add DB check to track endpoint — 30 min
7. R7/R8 (MEDIUM): DB constraints; add CSP + HSTS — 30 min

**Estimated time to launch-ready: ~2.5 hours.** The structural work is done.
