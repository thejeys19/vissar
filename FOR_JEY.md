# FOR_JEY.md — Things I Need From You Before Final Polish

These require your accounts, credentials, or manual verification.
Everything else I'm handling. Come back to these once I give you the MVP-done signal.

---

## 🔴 Blockers (needed to fully verify MVP before launch)

### 1. Test a real widget embed on an external page
- Create a widget in the dashboard
- Copy the embed code
- Paste it into any live webpage or a local HTML file
- Confirm: reviews load, branding shows, carousel works
- Optional: test on mobile

### 2. Verify Stripe checkout works with a real card
- Click "Upgrade to Pro" in the dashboard
- Go through checkout with a test card (Stripe test mode: `4242 4242 4242 4242`)
- Confirm you land back on `/dashboard/billing?success=true`
- Confirm your plan upgrades in the dashboard
- If Stripe is in live mode, use your real card or switch to test mode first

### 3. Confirm Google OAuth redirect URI is correct
- Try signing in fresh (incognito browser)
- Confirm it doesn't loop or error
- If it errors: go to Google Cloud Console → APIs → OAuth → check authorized redirect URIs

---

## 🟡 Nice-to-have before launch (can do after)

### 4. Add a real business/place to your own widget
- Go to Create Widget → search for a real business
- Confirm the Google Places search works and pulls real reviews
- This also verifies the Google Places API key is active

### 5. Test analytics tracking
- After embedding a widget externally (task 1 above)
- Load the page a few times
- Check Analytics tab in dashboard
- Views should increment (may take a minute)

### 6. Confirm Stripe webhook is configured in Stripe dashboard
- Go to Stripe → Webhooks
- Should have an endpoint pointing to: `https://www.vissar.com/api/webhook`
- Should be listening for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- If missing, add it

### 7. Decide: video testimonial cards — MVP or post-MVP?
- I have NOT built YouTube/Loom embed support
- This is a new layout type that would take real work
- Do you want it before launch, or can it wait?

### 8. Decide: responsive breakpoint controls in builder — MVP or post-MVP?
- Currently the widget has responsive behavior (1 col mobile, 2 col tablet, 3 col desktop)
- But user can't configure "show 2 columns on mobile" type controls in the builder
- This is doable but is it needed for launch?

---

## ✅ Already handled (no action needed)
- Stripe payment_method_types fix (was blocking credit cards) — fixed
- CORS on tracking endpoint — fixed
- Widget embed shows real saved ID — fixed  
- Widget tier/branding security — fixed (server now sends authoritative config)
- Build passes
