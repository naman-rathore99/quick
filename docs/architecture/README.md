# Project graph

```mermaid
flowchart LR
    Users["Visitors, customers and Didis"] --> Web["Next.js web app"]
    Web --> Cart["Cart in the browser"]
    Web --> API["Express API"]
    API --> Auth["Supabase Auth"]
    API --> DB["Supabase database"]
    Web -. "Google sign-in needs a callback" .-> Auth
```

- **Web** (`apps/web`) contains pages, navigation, account forms, the cart, and checkout. The service menu currently reads a local catalog.
- **API** (`apps/api`) handles account requests, service and provider data, and booking endpoints.
- **Supabase** manages identities and stores application data such as user roles, provider services, and bookings.
- **Mobile** (`apps/mobile`) is a separate workspace.

```mermaid
flowchart LR
    Services["Choose a service"] --> Cart["Add to cart"]
    Cart --> Checkout["Open checkout"]
    Checkout -. "Submission missing" .-> Booking["Save booking in API"]
    Booking -. "Assignment flow missing" .-> Provider["Didi sees assigned booking"]
```

The solid arrows show connected steps. The dotted arrows show gaps in the intended journey.
