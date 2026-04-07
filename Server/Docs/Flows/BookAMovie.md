# Book a Movie Flow (Stripe + Atomic Seat Lock)

```mermaid
flowchart TD

  A[User selects show + seats] --> B[POST /api/booking/create-payment-intent]
  B --> C[Backend validates show + seats + seat limit 10]
  C --> D[Backend checks show not started]
  D --> E[Backend checks seats not already booked]
  E --> F[Backend computes final amount server-side]
  F --> G[Stripe PaymentIntent created with metadata showId seats userId]
  G --> H[Client confirms payment using clientSecret]

  H --> I[POST /api/booking/book-show with paymentIntentId]
  I --> J[Backend verifies Stripe payment status succeeded]
  J --> K[Backend validates metadata matches user/show/seats]
  K --> L[Atomic seat lock with findOneAndUpdate + nin + push each]
  L --> M{Seat conflict?}
  M -->|Yes| N[409 SEAT_CONFLICT]
  M -->|No| O[Create booking document]
  O --> P[Commit Mongo transaction]
  P --> Q[Async ticket email sent]
  Q --> R[200 Payment and booking successful]
```

## Key implementation updates

- Pricing is trusted only from backend (`seats * show.ticketPrice * 100`).
- Transaction idempotency uses unique `transactionId = paymentIntentId`.
- Seat allocation uses atomic DB update to prevent double booking under concurrency.
- Booking stores payment amount and status for audit/refund workflows.