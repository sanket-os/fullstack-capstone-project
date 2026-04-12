# Entity Relationship Diagram (Current Data Model)

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        string name
        string email UNIQUE
        string password
        string role
        string otp
        date otpExpiry
        date createdAt
        date updatedAt
    }

    THEATRES {
        ObjectId _id PK
        string name
        string address
        string phone
        string email
        boolean isActive
        ObjectId ownerId FK
        date createdAt
        date updatedAt
    }

    MOVIES {
        ObjectId _id PK
        string movieName UNIQUE
        string description
        number duration
        string genre
        string language
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
        string bookedSeats
        ObjectId movieId FK
        ObjectId theatreId FK
        date createdAt
        date updatedAt
    }

    BOOKINGS {
        ObjectId _id PK
        ObjectId showId FK
        ObjectId userId FK
        string seats
        string transactionId UNIQUE
        number amount
        string currency
        string paymentStatus
        date createdAt
        date updatedAt
    }

    USERS ||--o{ THEATRES : owns
    USERS ||--o{ BOOKINGS : books
    MOVIES ||--o{ SHOWS : scheduled_in
    THEATRES ||--o{ SHOWS : hosts
    SHOWS ||--o{ BOOKINGS : reserved_by
```

**Enums:**
- role → admin | partner | user  
- paymentStatus → succeeded | pending | failed  

**Arrays:**
- genre, language → string[]  
- bookedSeats, seats → number[]

## Notes

- `THEATRES.isActive` defaults to `false`, so newly added theatres require admin approval.
- `BOOKINGS.transactionId` stores Stripe `paymentIntent.id` and is unique for idempotency.
- `SHOWS.bookedSeats` is used for atomic seat locking during booking.
- `USERS.otp` and `USERS.otpExpiry` support forgot-password OTP verification.