# Forgot Password / Reset Password Flow

```mermaid
flowchart TD
  A[User clicks Forgot Password] --> B[POST /api/users/forget-password with email]
  B --> C{User exists?}
  C -->|No| D[404 USER_NOT_FOUND]
  C -->|Yes| E{Valid OTP already active?}
  E -->|Yes| F[429 OTP_ALREADY_SENT]
  E -->|No| G[Generate 6 digit OTP + 10 minute expiry]
  G --> H[Store otp and otpExpiry in user]
  H --> I[Send OTP email]
  I --> J[200 OTP sent]

  J --> K[User submits new password + otp]
  K --> L[POST /api/users/reset-password]
  L --> M{OTP found?}
  M -->|No| N[404 Invalid OTP]
  M -->|Yes| O{OTP expired?}
  O -->|Yes| P[Clear otp fields + 401 OTP_EXPIRED]
  O -->|No| Q[Hash new password with bcrypt]
  Q --> R[Save password and clear otp fields]
  R --> S[200 Password reset successful]
```

## Key implementation updates

- OTP replay protection blocks repeated OTP requests within valid window.
- OTP and password reset operations are always done on server side.
- OTP data is cleared on expiry and successful reset.