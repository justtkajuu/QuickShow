# QuickShow

![Vercel](https://img.shields.io/badge/deploy-Vercel-blue) ![Node.js](https://img.shields.io/badge/backend-Node.js-brightgreen) ![React](https://img.shields.io/badge/frontend-React-blue)

Full-stack movie show booking app — React + Vite frontend and Node/Express backend with MongoDB, Stripe payments, and Clerk authentication.

## Key Features

- Browse and search movies and showtimes
- Book seats with an interactive seat layout
- Stripe payment integration for secure checkout
- Admin panel to add shows and view bookings
- Email notifications via Nodemailer
- Background/webhook processing with Inngest

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, react-router
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Auth: Clerk
- Payments: Stripe
- Background tasks / webhooks: Inngest
- Media: Cloudinary

## Repo Structure

- client/ — React app (Vite)
- server/ — Express API and background handlers
- configs/, controllers/, models/, routes/ — server internals

## Quick Start (development)

1. Install dependencies for both client and server

```bash
# from repo root
cd client
npm install
npm run dev

# in a separate terminal
cd ../server
npm install
npm run server
```

2. Open the client at http://localhost:5173 (Vite default) and ensure the server runs on its configured port (check server/server.js).

## Environment Variables

Create a .env file in server/ with at least:

- MONGO_URI — MongoDB connection string
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET — Cloudinary creds (if used)
- STRIPE_SECRET_KEY — Stripe secret key
- EMAIL_USER, EMAIL_PASS — SMTP credentials for Nodemailer
- CLERK_SECRET / Clerk-related envs if Clerk is configured

Adjust names to match the server's process.env usage in configs.

## Build & Deploy

- The client can be built with npm run build and deployed to Vercel, Netlify, or similar.
- The server can be deployed to platforms that support Node.js (Vercel Serverless, Heroku, Render, etc.).
- Remember to set all environment variables in your hosting provider.

## Live Demo

Visit the live site: https://quickshow-web.vercel.app/
