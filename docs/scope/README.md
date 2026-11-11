# Project scope

The main product is a website that helps customers find household services and helps Didis list their work and see appointments assigned to them.

- **Visitors** can explore the homepage and service menu, build a cart, and open account and partner pages.
- **Customers** can sign in with email and open checkout. The cart works, but checkout does not create a booking or take payment yet.
- **Didis** can open the partner application. Signed-in accounts with the provider role get a **Bookings** link for assigned appointments. Live onboarding and role changes still need end-to-end verification.
- **Mobile app** code lives in `apps/mobile`. This guide covers the web app and its API.

A first usable release needs one complete journey from choosing a service to seeing a saved booking and a clear confirmation. It also needs a way for the correct Didi to receive that booking. The [gap list](../roadmap/README.md) describes what remains.
