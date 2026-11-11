# User workflows

## Customer

1. Open **Home** (`/`) and choose a service. **Add service** updates the cart.
2. Open **Cart** and proceed to **Checkout** (`/checkout`).
3. Enter contact and address details and select a date and time. The current form shows a fixed order summary and **Pay & Book** has no submit action.
4. The intended next step is a confirmation showing what was booked, when, and whether payment is due. A customer booking history page is also missing.

## Didi or service provider

1. Open **Become a Didi** (`/partner`) and start the application (`/onboarding/provider`).
2. Enter a service area, services, prices, and bio. The app requires sign-in before submission. Guests can lose their draft when redirected to login.
3. After onboarding, the app sends the provider to **Assigned bookings** (`/provider-bookings`). The navbar shows **Bookings** for signed-in provider accounts. The API returns only bookings assigned to that provider.
4. The connection from customer checkout to provider assignment is still missing.

## Account access

- **Login** (`/login`) supports email and password. The Google button targets a missing dashboard route and needs a working callback.
- **Sign-up** (`/signup`) collects name, email, and password. The form needs a clear check-your-email state when confirmation is enabled.
- **Forgot password** (`/forgot-password`) requests a recovery email and gives a generic response.
- **Reset password** (`/reset-password`) accepts a recovery link and a new password. Live email delivery and link expiry still need verification.
