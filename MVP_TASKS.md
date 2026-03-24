# MVP Fix Tasks

## Critical Issues to Fix

### 1. PAYMENT - Stripe checkout blocks credit cards
File: `app/api/checkout/route.ts`
Remove `payment_method_types: ['link']` — this restricts payment to Stripe Link only (no cards)
Fix: remove the `payment_method_types` field entirely (Stripe defaults to card + other enabled methods)

### 2. SECURITY - Widget tier/branding trust comes from client data-attributes
The widget JS reads `data-vissar-tier` and `data-vissar-remove-branding` from HTML attributes.
Anyone can inspect the embed code and add `data-vissar-tier="pro"` to remove branding.

Fix: 
- The widget API response at `/api/widget/[id]/reviews` should include the full widget config from DB:
  `tier`, `removeBranding`, `customCss`, and all display options
- The widget JS `fetchReviews()` should override the data-attribute config with the server-returned widget config after fetching
- Add this to the reviews API response: pull widget config fields and include in `widget` object

### 3. EMBED CODE BUG - Uses unsaved name slug instead of real widget ID
File: `app/dashboard/widget/new/page.tsx` line ~248
`const widgetSlug = widgetId || config.name.toLowerCase().replace(/\s+/g, '-') || 'my-widget'`

The embed code shown before saving uses the slug name. After saving, `widgetId` is a real ID like `widget_1234`.
Fix: After step 1 (save/create), fetch the widgetId from API response and update all embed code display to use the real `widgetId`.
Also ensure at step 3 (get code), we always show the real saved ID.

### 4. WIDGET REVIEWS API - needs to return full widget config for server-side auth
File: `app/api/widget/[id]/reviews/route.ts`

Currently returns:
```json
{ "widget": { "id": "...", "name": "...", "layout": "...", "autoStyle": true } }
```

Needs to return:
```json
{
  "widget": {
    "id": "...", "name": "...", "layout": "...", "autoStyle": true,
    "tier": "free",           // from DB/plans
    "removeBranding": false,  // from widget config in DB
    "viewLimit": 200,         // from user plan
    "template": "soft",
    "showHeader": false,
    "showHighlights": false,
    "showVerifiedBadge": true,
    "showAvatar": true,
    "showDate": true,
    "animations": true,
    "animationStyle": "slideUp",
    "colorScheme": "auto",
    "sortBy": null,
    "textLength": 150,
    "starColor": null,
    "primaryColor": null,
    "language": "all",
    "dateRange": "all",
    "showSentimentBadges": true,
    "showReplies": true,
    "gdpr": false,
    "customCss": null
  }
}
```

### 5. WIDGET JS - should merge server config over data-attribute config
After `fetchReviews()` completes and `this.widget` is set, merge the server widget config
into `this.config` (server wins for security-sensitive fields: tier, removeBranding, viewLimit).
The widget script is at `public/widget/vissar-widget.min.js` — this is minified.
We need a source version OR we patch the minified file carefully by finding the fetchReviews function.

### 6. VIEW COUNTING - not enforced server-side
Currently view limit enforcement is localStorage-based (client-side, bypassable).
The server-side `/api/track` endpoint exists and increments Redis counters.
But `/api/usage` should check if user is over limit and return 429 for non-pro widgets.
For MVP, the localStorage approach is acceptable IF we fix the tier/removeBranding security issue.
Defer full server-side enforcement to post-MVP.

### 7. MISSING: Widget save must happen BEFORE showing embed code
Currently step flow is: Configure (step 1) → Style (step 2) → Get Code (step 3)
The widget is saved when user clicks "Finish" at step 3, but the embed code shown in step 3 may use an un-saved widget.
Fix: Save the widget automatically when going from step 2 to step 3 (or when reaching step 3), so the embed code always shows the real saved widget ID.

### 8. AUTH - sign-in page should support Google + Magic Link/email fallback
Check `lib/auth.ts` - if only Google OAuth is configured, users without Google accounts can't sign up.
For MVP, just ensure Google OAuth works cleanly.

### 9. DASHBOARD - widget card embed snippet should show real embed code
File: `components/widget-card.tsx`
The embed snippet shown on the widget card should include all critical data attributes (layout, template, etc.)

### 10. ANALYTICS - dashboard shows 0 views even when widget is loaded
Ensure `/api/track` CORS headers are set (it's called from external sites).
File: `app/api/track/route.ts` - add CORS headers for OPTIONS and POST responses.

### 11. LANDING PAGE - pricing section should use real Stripe checkout links
Currently pricing CTAs may go to `/auth/signin` then manually to billing.
Should flow: click "Get Pro" → sign in if not authed → go directly to billing/checkout.

## Files to check/fix in order:
1. `app/api/checkout/route.ts` - fix payment_method_types
2. `app/api/widget/[id]/reviews/route.ts` - return full widget config including tier
3. `app/api/track/route.ts` - add CORS headers
4. `app/dashboard/widget/new/page.tsx` - auto-save before step 3, fix embed code slug
5. `components/widget-card.tsx` - fix embed snippet
6. `public/widget/vissar-widget.min.js` - merge server config after fetch (careful edit)
7. `app/landing/page.tsx` - verify pricing CTAs go to checkout for authed users

## After fixes, test checklist:
- [ ] Create widget → embed code uses real widget ID
- [ ] Embed on a test page → reviews load
- [ ] Free tier → "Powered by Vissar" shows
- [ ] Pro tier → branding removed (verify server enforces this)
- [ ] Analytics page shows views after embed loads
- [ ] Stripe checkout → can pay with credit card
- [ ] Widget appears correctly on mobile
