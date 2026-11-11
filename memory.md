# QuickDidi work log

This is the running record of work done on QuickDidi. Start with the [documentation index](docs/README.md) for the project guide.

## How to keep this log

For each future QuickDidi task, append a dated entry with the request, changes made, checks run and their results, and anything still open. Record decisions that affect how the product works. Keep credentials, personal data, and raw logs out of this file.

## Through November 8, 2026

- **Local setup.** Started the Next.js web app and the Express API. The checked-in workspace's existing local API build referenced MongoDB, so the development server ran the current Supabase-based source. The homepage returned 200 and the API health endpoint reported healthy.
- **Web redesign.** Introduced the cream-and-forest design, illustrated homepage, revised service menu, and shared styling for account, checkout, and partner pages. Fixed homepage calls to action and outdated navigation links. Verified that adding a service updates the cart.
- **Auth hardening.** Added local rate limits to login, registration, refresh, Google token exchange, and both password recovery endpoints. Verified all six returned 429 with a retry header at their limits. Isolated session-changing Supabase operations per request and updated recovery token handling. Google OAuth and real email delivery still need end-to-end checks.
- **Provider access.** Added a provider-only Bookings link and assigned bookings page. The API checks the provider role and filters bookings by the signed-in provider's ID. Customers and guests see Cart. Verified the endpoint returns 401 for signed-out requests. Live provider and customer role tests remain open.

## November 9, 2026

- **Full web review.** Checked all nine local page routes and traced their main actions through the code. All nine returned HTTP 200 and both apps passed TypeScript checks. The Google OAuth destination returned 404. Identified the unfinished checkout, client-controlled booking fields, and non-atomic provider onboarding as priority issues.
- **Project documentation.** Added a plain-language guide, route and user workflows, project diagrams, a prioritized gap list, and this log. The documentation separates working features from unfinished flows and unverified integrations.
- **Booking and account fixes.** Replaced the fixed checkout with cart-based appointment requests, live provider prices, and server-side validation. Added SQL migrations for booking details, duplicate request protection, provider slot conflicts, and atomic provider onboarding. Added Google callback handling, an email confirmation screen, sign-out controls, and a missing recovery link state. Replaced sample provider cards with the public provider API.
- **Live verification.** Local API health responded, but Supabase-backed reads returned an upstream 521 while the project was restarting. The migrations have not been applied. Real bookings, Google OAuth, email delivery, and role isolation require staging verification.
- **Supabase restored.** Confirmed the public API returned eight live services and zero provider offers. Verified signed-out assigned-bookings access returns 401 and the updated web routes load. Connected the homepage, cart and checkout to the same live catalog and removed sample prices from the shopping flow.
- **Booking usability.** Added customer appointment history and a link from checkout confirmation. The homepage now explains the pending request flow, omits sample reviews and unsupported claims, and labels services without listed providers. The cart explains that checkout handles one service at a time. Database migrations and a test provider are still needed for a complete live booking.
- **Booking migration correction.** Supabase rejected the lowercase booking status with SQLSTATE 22P02. Updated the index predicate and API insert to use the uppercase booking enum labels defined in the project schema. The corrected migration still needs a live run.
- **Live enum alignment.** Confirmed from Supabase that active booking statuses are PENDING and ACCEPTED and payment starts at PENDING. Updated the booking migration and API to match.
- **Live onboarding test.** Booking columns are present. A disposable provider signed in, but onboarding returned 503 because the live role enum rejects lowercase provider. Read-only checks confirmed PROVIDER and CUSTOMER are accepted. Updated the onboarding SQL to use PROVIDER and create a public profile from the authenticated account when needed. Removed the test account. The corrected SQL still needs to be applied and retested.
- **Onboarding retest.** Test sign-in passed. The onboarding RPC reached the database but failed with 42501 because it reads auth.users as service_role. Updated the function to run as its owner with a fixed search path and keep execution restricted to service_role. Removed the disposable account. The SQL needs to be reapplied before retesting.
- **Live retest.** Provider sign-in passed and onboarding reached the profile insert. Supabase rejected the insert with 23502 because users.phone is required. Added a validated provider phone field and updated the RPC signature. Removed the temporary test account.
- **Live booking passed.** Provider onboarding succeeded. Checkout initially failed with 23503 because the customer had no public profile. Updated checkout API to create the customer profile when missing. Retested sign-in, provider onboarding, server pricing, pending status, idempotent retry, duplicate slot rejection, both booking views, and customer access denial. Removed temporary records.
- **Didi responses.** Added Accept and Decline to assigned bookings. Live API testing confirmed accepted status in customer history, safe retries, customer denial, and a declined request saved as CANCELLED. Both apps passed TypeScript checks and the disposable test records were removed. Two-browser and external sign-in/email checks remain.
- **Service selection.** Confirmed the live provider API returned zero offers. Kept availability labels and allowed customers to add any listed service to the cart. Checkout still requires a provider offer before submitting.
- **Homepage design refinement.** Simplified the hero and removed decorative labels. Replaced animated service cards with a compact catalog and visible cart quantities. TypeScript and diff checks passed.
