# Admin Approves a Theatre Flow

```mermaid
flowchart TD

  A[Partner/Admin logs in] --> B[POST /api/theatre/add-theatre]
  B --> C[Theatre created with owner from JWT]
  C --> D[isActive forced to false]
  D --> E[Theatre remains pending]

  E --> F[Admin opens theatre management]
  F --> G[GET /api/theatre/get-all-theatres]
  G --> H[Admin reviews theatre + owner details]
  H --> I[PUT /api/theatre/update-theatre with theatreId + isActive true]
  I --> J[Theatre becomes active]
  J --> K[Shows from this theatre are considered valid for listing]

  H --> L[Optional reject path]
  L --> M[Admin keeps isActive false or updates non-active details]
```

## Key implementation updates

- Theatre `owner` is always derived from authenticated user (not trusted from client body).
- Partners cannot self-approve because partner-side update strips `isActive`.
- Admin can activate theatre through update endpoint.