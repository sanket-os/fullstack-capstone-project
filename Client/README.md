# BookMyShow Client

Frontend application for the BookMyShow capstone project, built with **React + Vite**.


## Tech Stack

- React 19 + Vite 7
- React Router 7
- Redux Toolkit + React Redux
- Ant Design 5
- Stripe Elements (`@stripe/react-stripe-js`)
- Axios (with centralized interceptors)


## Features

- Role-based app sections:
  - **User**: browse movies, view shows, book seats, and view bookings
  - **Partner**: manage theatres and shows
  - **Admin**: manage movies and theatre approvals
- Auth with protected routes and cookie-based session (`withCredentials: true`)
- Booking flow integrated with Stripe Payment Element
- Global loading state and standardized API error mapping
- Dark/light theme support on public auth pages

## Project Structure

Client/
├── src/
│   ├── api/                # Axios instance + API modules
│   ├── components/         # Shared UI components (e.g., ProtectedRoute)
│   ├── pages/              # Route pages (Admin, Partner, User flows)
│   ├── redux/              # Store + slices
│   ├── theme/              # Theme context/provider
│   ├── test/               # Node test files
│   ├── App.jsx             # Route map
│   └── main.jsx            # App bootstrap
├── public/
├── index.html
├── vite.config.js
└── package.json


## Prerequisites

- Node.js 18+
- npm 9+
- Backend server running on `http://localhost:3000`


## Environment Variables

Create `Client/.env` with:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxx
```

## Local Setup

```bash
cd Client
npm install
npm run dev
```
By default, Vite runs on `http://localhost:5173`.


## API Proxy

The dev server proxies API calls from `/bms/v1` to `http://localhost:3000` (configured in `vite.config.js`).


## Available Scripts

```bash
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview production build
npm run lint     # eslint checks
npm run test     # node --test
```

## Auth + Routing Notes

- App routes are declared in `src/App.jsx`.
- Protected routes are guarded by `src/components/ProtectedRoute.jsx`.
- Token/session is handled via HTTP-only cookie from backend (`bms_token`).


## Important Integration Notes

- `src/api/index.js` enables `withCredentials: true` for cookie auth.
- Stripe publishable key is consumed in booking flow from `import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY`.
- Ensure backend CORS and cookie settings match local frontend origin.
