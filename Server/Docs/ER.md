# Entity Relationship Diagram (Current Data Model)

```mermaid

erDiagram
    USERS {
        ObjectId _id PK
        string name
        string email UNIQUE
        string password
        enum role "admin|partner|user"
        string otp "nullable"
        date otpExpiry "nullable"
        date createdAt
        date updatedAt
    }

    THEATRES {
        ObjectId _id PK
        string name
        string address
        number phone
        string email
        boolean isActive
        ObjectId owner FK
        date createdAt
        date updatedAt
    }

    MOVIES {
        ObjectId _id PK
        string movieName UNIQUE
        string description
        number duration
        string[] genre
        string[] language
        date releaseDate
        string poster
    }

    SHOWS {
        ObjectId _id PK
        string name
        date date
        string time
        number ticketPrice
        number totalSeats
        number[] bookedSeats
        ObjectId movie FK
        ObjectId theatre FK
        date createdAt
        date updatedAt
    }

    BOOKINGS {
        ObjectId _id PK
        ObjectId show FK
        ObjectId user FK
        number[] seats
        string transactionId UNIQUE
        number amount
        string currency
        enum paymentStatus "succeeded|pending|failed"
        date createdAt
        date updatedAt
    }

    USERS ||--o{ THEATRES : owns
    USERS ||--o{ BOOKINGS : books
    MOVIES ||--o{ SHOWS : scheduled_in
    THEATRES ||--o{ SHOWS : hosts
    SHOWS ||--o{ BOOKINGS : reserved_by
```

## Notes

- `THEATRES.isActive` defaults to `false`, so newly added theatres require admin approval.
- `BOOKINGS.transactionId` stores Stripe `paymentIntent.id` and is unique for idempotency.
- `SHOWS.bookedSeats` is used for atomic seat locking during booking.
- `USERS.otp` and `USERS.otpExpiry` support forgot-password OTP verification.