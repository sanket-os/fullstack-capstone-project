const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "BookMyShow API",
    version: "1.2.0",
    description:
      "Swagger documentation for key capstone APIs only (focused and accurate: 8-12 core endpoints).",
  },
  servers: [
    {
      url: "/bms/v1",
      description: "Base API path",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Jane Doe" },
          email: { type: "string", format: "email", example: "jane@example.com" },
          password: { type: "string", format: "password", example: "StrongPass123" },
          role: { type: "string", enum: ["user", "partner", "admin"], example: "user" },
        },
      },

      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "jane@example.com" },
          password: { type: "string", format: "password", example: "StrongPass123" },
        },
      },

      AddMovieRequest: {
        type: "object",
        required: ["movieName", "description", "duration", "genre", "language", "releaseDate", "poster"],
        properties: {
          movieName: { type: "string", example: "Inception" },
          description: { type: "string", example: "A skilled thief enters dreams to steal secrets." },
          duration: { type: "number", example: 148 },
          genre: {
            type: "array",
            items: { type: "string" },
            example: ["Sci-Fi", "Thriller"],
          },
          language: {
            type: "array",
            items: { type: "string" },
            example: ["English"],
          },
          releaseDate: { type: "string", format: "date", example: "2010-07-16" },
          poster: { type: "string", format: "uri", example: "https://example.com/inception-poster.jpg" },
        },
      },

      UpdateMovieRequest: {
        type: "object",
        required: ["movieId"],
        properties: {
          movieId: { type: "string", example: "65f8e2f71e953fc48d80f2a1" },
          movieName: { type: "string", example: "Inception (Remastered)" },
          description: { type: "string", example: "Updated description" },
          duration: { type: "number", example: 150 },
          genre: {
            type: "array",
            items: { type: "string" },
            example: ["Sci-Fi", "Action"],
          },
          language: {
            type: "array",
            items: { type: "string" },
            example: ["English", "Hindi"],
          },
          releaseDate: { type: "string", format: "date", example: "2010-07-16" },
          poster: { type: "string", format: "uri", example: "https://example.com/inception-new.jpg" },
        },
      },

      TheatreRequest: {
        type: "object",
        required: ["name", "address", "phone", "email", "ownerId"],
        properties: {
          name: { type: "string", example: "PVR Downtown" },
          address: { type: "string", example: "MG Road, Bengaluru" },
          phone: { type: "string", example: "9876543210" },
          email: { type: "string", format: "email", example: "owner@pvr.com" },
          ownerId: { type: "string", example: "65f8e2f71e953fc48d80f2aa" },
        },
      },

      ShowRequest: {
        type: "object",
        required: ["showName", "movie", "theatre", "date", "time", "ticketPrice", "totalSeats"],
        properties: {
          showName: { type: "string", example: "Evening Show" },
          movie: { type: "string", example: "65f8e2f71e953fc48d80f2a1" },
          theatre: { type: "string", example: "65f8e2f71e953fc48d80f2b1" },
          date: { type: "string", format: "date", example: "2026-03-20" },
          time: { type: "string", example: "18:30" },
          ticketPrice: { type: "number", example: 250 },
          totalSeats: { type: "number", example: 120 },
        },
      },

      PaymentIntentRequest: {
        type: "object",
        required: ["showId", "seats"],
        properties: {
          showId: { type: "string", example: "65f8e2f71e953fc48d80f2c1" },
          seats: {
            type: "array",
            items: { type: "number" },
            example: [1, 2, 3],
          },
        },
      },

     
      BookingRequest: {
        type: "object",
        required: ["showId", "seats", "paymentId"],
        properties: {
          showId: { type: "string", example: "65f8e2f71e953fc48d80f2c1" },
          seats: {
            type: "array",
            items: { type: "number" },
            example: [1, 2, 3],
          },
          paymentId: { type: "string", example: "pi_3OkabcXYZ" },
        },
      },
    },
  },

  tags: [
    { name: "Users" },
    { name: "Movies" },
    { name: "Theatres" },
    { name: "Shows" },
    { name: "Bookings" },
  ],

  paths: {
    "/users/register": {
      post: {
        tags: ["Users"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: { description: "User registered" },
        },
      },
    },

    "/users/login": {
      post: {
        tags: ["Users"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: { description: "Login success" },
        },
      },
    },

    "/users/getCurrentUser": {
      get: {
        tags: ["Users"],
        summary: "Get authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Current user" },
        },
      },
    },

    "/movies/getAllMovies": {
      get: {
        tags: ["Movies"],
        summary: "Get all movies",
        responses: {
          200: { description: "Movie list" },
        },
      },
    },

    "/movies/addMovie": {
      post: {
        tags: ["Movies"],
        summary: "Add movie (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddMovieRequest" },
            },
          },
        },
        responses: {
          201: { description: "Movie created" },
        },
      },
    },

    "/theatres/addTheatre": {
      post: {
        tags: ["Theatres"],
        summary: "Create theatre (partner)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TheatreRequest" },
            },
          },
        },
        responses: {
          201: { description: "Theatre created" },
        },
      },
    },

    "/shows/addShow": {
      post: {
        tags: ["Shows"],
        summary: "Create show (partner)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ShowRequest" },
            },
          },
        },
        responses: {
          201: { description: "Show created" },
        },
      },
    },

    "/bookings/createPaymentIntent": {
      post: {
        tags: ["Bookings"],
        summary: "Create payment intent",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PaymentIntentRequest" },
            },
          },
        },
        responses: {
          200: { description: "Payment intent created" },
        },
      },
    },

    "/bookings/makePaymentAndBookShow": {
      post: {
        tags: ["Bookings"],
        summary: "Verify payment and create booking",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BookingRequest" },
            },
          },
        },
        responses: {
          201: { description: "Booking successful" },
        },
      },
    },
  },
};

module.exports = openApiSpec;