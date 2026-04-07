# User Registration and Login Flow

```mermaid
flowchart TD

  A[User opens app] --> B{Action}
  B -->|Register| C[Submit name, email, password]
  C --> D[POST /api/users/register]
  D --> E{Email already exists?}
  E -->|Yes| F[409 USER_ALREADY_EXISTS]
  E -->|No| G[Password hashed with bcrypt]
  G --> H[User created with default role user]
  H --> I[200 Registration Successful]

  B -->|Login| J[Submit email + password]
  J --> K[POST /api/users/login]
  K --> L{User exists?}
  L -->|No| M[401 INVALID_CREDENTIALS]
  L -->|Yes| N{Password matches hash?}
  N -->|No| O[401 INVALID_CREDENTIALS]
  N -->|Yes| P[JWT created with userId email role]
  P --> Q[httpOnly cookie bms_token set]
  Q --> R[200 Logged in]

  R --> S[GET /api/users/current-user]
  S --> T[Authorization middleware verifies JWT]
  T --> U[User profile returned]
```

## Key implementation updates

- Authentication token is stored in `bms_token` cookie (`httpOnly`, `sameSite=lax`).
- JWT payload includes `userId`, `email`, and `role` for role-based access control.
- Password is always hashed before persistence; plain passwords are never stored.