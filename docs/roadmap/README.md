# What's missing

## 1. Finish checkout and booking

- Use the real cart in checkout and save validated contact, address, and appointment details.
- Calculate prices on the API, check availability and provider eligibility, and prevent duplicate bookings when requests are retried.
- Show the actual booking status. Decide whether payment is collected online or later and make the button and confirmation match that decision.
- Connect bookings to a provider, then give customers a way to view their bookings.

## 2. Finish account and provider flows

- Fix the Google callback and connect it to the app session. Add sign-out and handle expired sessions.
- Show an email confirmation state after sign-up. Verify recovery email delivery and test valid, expired, and reused links.
- Keep a Didi's application draft through sign-in. Save the provider role and services together, and prevent duplicate services on retries.
- Verify that customers receive 403 from the assigned bookings endpoint and that two providers see only their own appointments. Signed-out access has already been checked.

## 3. Connect live data and polish the experience

- Use live catalog and provider data. Give provider profile buttons real destinations and verify homepage claims and testimonials.
- Add field labels, keyboard support, and accessible date and time selection. Check mobile menus and dialogs.
- Before release, verify production cookie behavior and rate limiting behind the hosting proxy. The current limits reset on restart and are counted separately by each API instance.
- Run the full booking and account journeys in staging with test accounts and a test inbox.

## Implementation update

Checkout now submits a pending appointment request for one service at a time, using the selected provider's price. Payment remains a separate decision. The Google callback and provider onboarding transaction are implemented in code. Apply the two SQL files in `apps/api/supabase/migrations` to the intended database before testing booking creation and onboarding. Add the web app's `/auth/callback` URL to the Supabase redirect allow list and test with a staging account and inbox.
