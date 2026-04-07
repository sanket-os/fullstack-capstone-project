# 🎬 BookMyShow Capstone Project

A full-stack movie ticket booking platform inspired by BookMyShow, built as a capstone project.

This repository contains:
- **Client**: React + Vite frontend
- **Server**: Node.js + Express API
- **MongoDB**: Persistent storage for users, movies, theatres, shows, and bookings
- **Stripe**: Payment flow for ticket booking

## 🔗 Live Demo

- **Frontend:** `[https://your-frontend-url](https://fullstack-capstone-project-o3s2.onrender.com)`
- **Backend/API Base:** `[https://your-backend-url/bms/v1](https://fullstack-capstone-project-o3s2.onrender.com/bms/v1)`
- **API Docs (Swagger):** `https://fullstack-capstone-project-o3s2.onrender.com/bms/v1/docs/`


## 🖼️ Screenshots

### 🎥 App Demo (Full Flow)
![App Demo](./docs/screenshots/demo.gif)

### 📸 Key Screens

![Home Page](./docs/screenshots/Home-Page.png)
![Movie Details](./docs/screenshots/Movie-Details-Page.png)
![Seat Booking](./docs/screenshots/Seat-Selection-UI.png)
![Payment Success](./docs/screenshots/Payment-Success-Screen.png)

## 🚀 Features

### User-facing
- User registration, login, logout, and current-user session APIs
- Forgot-password with OTP and reset-password flow
- Browse movies and view movie details
- Browse theatres/shows and book seats
- Stripe PaymentIntent integration for secure payments
- My Bookings page and booking success flow

### Role-based access
- **Admin** can manage movies and approve/update theatres
- **Partner** can add and manage theatres/shows
- **User** can book shows and view personal bookings

### Security and platform reliability
- JWT-based authentication + httpOnly cookie session token
- Role middleware (`admin`, `partner`, `user`)
- Request payload validation (Zod)
- Helmet security headers and CSP
- API rate limiting
- Mongo sanitize protections
- Centralized error handling

## 🏗️ Tech Stack

### Frontend (`/Client`)
- React 19
- React Router
- Redux Toolkit
- Ant Design
- Axios
- Vite

### Backend (`/Server`)
- Node.js + Express 5
- MongoDB + Mongoose
- JWT + bcrypt
- Zod validation
- Stripe
- Nodemailer
- Swagger (`/bms/v1/docs`)

## 📁 Project Structure

```text
fullstack-capstone-project/
├── Client/                  # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── redux/
│   │   └── api/
│   └── package.json
├── Server/                  # Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── validators/
│   └── package.json
├── HLD/                     # Design docs
├── docs/
│   └── screenshots/         # README images, gif
└── BookMyShow.postman_collection.json
```

## ✅ Prerequisites

- Node.js 18+
- npm 9+
- MongoDB connection URI (local or Atlas)
- Stripe account (test keys are fine for local development)
- Gmail app password (for OTP email delivery)

## ⚙️ Environment Variables

Create `Server/.env`:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
SECRET_KEY=<your_jwt_secret>
CLIENT_URL=http://localhost:5173
STRIPE_KEY=<your_stripe_secret_key>
GMAIL_USER=<your_gmail_address>
GMAIL_APP_PASSWORD=<your_gmail_app_password>
NODE_ENV=development
```

> The backend exits at startup if `PORT`, `SECRET_KEY`, or `MONGO_URI` are missing.

## 🧪 Local Development Setup

### 1) Install dependencies

```bash
cd Server && npm install
cd ../Client && npm install
```

### 2) Run backend

```bash
cd Server
npm start
```

Backend runs on `http://localhost:5000` (or your configured `PORT`).

### 3) Run frontend

```bash
cd Client
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## 🧭 API Overview

Base prefix: `/bms/v1`

- `POST /users/register`
- `POST /users/login`
- `GET /users/getCurrentUser`
- `POST /users/forgetPassword`
- `POST /users/resetPassword`
- `POST /users/logout`
- `GET /movies/getAllMovies`
- `POST /bookings/createPaymentIntent`
- `POST /bookings/makePaymentAndBookShow`
- `GET /bookings/getAllBookings`

For interactive API documentation, open:
- `GET /bms/v1/docs`

You can also import:
- `BookMyShow.postman_collection.json`

## 🧪 Testing

### Backend tests

```bash
cd Server
npm test
```

### Frontend tests

```bash
cd Client
npm test
```

## 📚 Design Documents

- `HLD/HLD.md` for architecture-level documentation
- `Server/Docs/` for flow-level docs and OpenAPI setup

## 🤝 Contributing

1. Fork / branch from main branch
2. Make changes with clear commit messages
3. Run relevant tests
4. Open a PR with a summary and test evidence


## 📄 License

This project is for educational/capstone use. Add a formal license if you plan to open-source it publicly.
