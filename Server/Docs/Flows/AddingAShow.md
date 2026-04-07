# Add / Manage Show Flow (Partner)

```mermaid
flowchart TD
  A[Partner logs in] --> B[Fetch own theatres]
  B --> C[GET /api/theatre/get-all-theatres-by-owner]
  C --> D[Partner selects theatre]
  D --> E[Partner selects movie + date + time + price + seats]
  E --> F[POST /api/show/add-show]
  F --> G[Show created with movie and theatre references]
  G --> H[Partner views theatre shows]
  H --> I[GET /api/show/get-all-shows-by-theatre/:theatreId]

  I --> J{Need changes?}
  J -->|Update| K[PUT /api/show/update-show]
  J -->|Delete| L[DELETE /api/show/delete-show/:showId]
  K --> M[Updated show returned]
  L --> N[Show removed]
```

## Key implementation updates

- Show stores seat inventory via `totalSeats` and runtime lock state via `bookedSeats`.
- Show queries heavily use `movie`, `date`, and `theatre` for discovery and filtering.
- Theatre-specific show listing populates movie details for partner dashboard UX.