# Personal CV Website

Production-ready personal website for a Senior Web3 Engineer and Technical Lead. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, and Firebase (Auth, Firestore, Storage). Deployed on Vercel.

## Features

- **Public site**: Hero, About, Experience, Projects, Skills, Certifications, Contact (all content from Firestore)
- **Admin dashboard** (`/admin`): CRUD for experiences, projects, skills, certifications; edit hero/about/settings; upload CV and project images; view contact messages
- **Auth**: Firebase Authentication; only users with `role: "admin"` in Firestore `users/{uid}` can access admin
- **Design**: Clean, minimal, founder-style (Stripe/Linear/Vercel inspired)

## Tech Stack

- Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion
- Firebase: Authentication, Firestore, Storage (no Firebase Hosting)

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd cv-website
npm install
```

### 2. Firebase

1. Create a project in [Firebase Console](https://console.firebase.google.com).
2. Enable **Authentication** (Email/Password).
3. Create **Firestore** database.
4. Create **Storage** bucket.
5. In **Project settings** → General → Your apps, add a Web app and copy the config object.

### 3. Firebase config

Edit `lib/firebase.ts` and replace the placeholder values with your Firebase config (or use environment variables and read them in the file):

```ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};
```

Do not commit real keys. Use `.env.local` for local development and set env vars in Vercel for production (see below).

### 4. Firestore rules

Deploy the Firestore rules:

```bash
firebase deploy --only firestore
```

Rules are in `firestore.rules`. Public read for `experiences`, `projects`, `skills`, `certifications`, `settings`; write only for authenticated users with `role == 'admin'`. Messages: anyone can create; only admin can read/delete.

### 5. Storage rules

Deploy the Storage rules:

```bash
firebase deploy --only storage
```

Rules are in `storage.rules`. Public read for `cv/` and `projects/`; write only for admin.

### 6. Create admin user

1. In Firebase Authentication, create a user (e.g. your email/password).
2. In Firestore, create a document at `users/<that-user-uid>` with fields:
   - `email` (string)
   - `role` (string): `"admin"`
   - `createdAt` (timestamp)

You can set `createdAt` to the current time in the console.

### 7. Seed example data (optional)

- **From the app**: Sign in at `/admin/login`, go to Dashboard, click **Load example data**.
- **From file**: See `scripts/seed-data.json` and `public/seed-data.json`. The dashboard button loads from `public/seed-data.json`.

### 8. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

## Vercel deployment

1. Push the repo to GitHub.
2. In [Vercel](https://vercel.com), import the GitHub repository.
3. **Environment variables**: If you read Firebase config from env in `lib/firebase.ts`, add in Vercel project settings:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)
4. Build command: `next build` (default). Output: Next.js.
5. Deploy. After deploy, add your Vercel domain (e.g. `your-site.vercel.app`) to Firebase Authentication → Authorized domains.

## Production hardening

- **Secrets**: Never commit Firebase config with real keys. Use environment variables and set them in Vercel (and keep `.env.local` in `.gitignore`).
- **Firebase App Check**: Consider enabling [App Check](https://firebase.google.com/docs/app-check) for Firestore and Storage to reduce abuse from non-app clients.
- **Contact form**: Consider rate-limiting (e.g. Vercel serverless or edge function by IP) to prevent spam.
- **Security headers**: Add headers in `next.config.mjs` or `vercel.json` (e.g. `X-Frame-Options`, `X-Content-Type-Options`, CSP if needed).
- **Lighthouse**: Aim for 90+ on performance, accessibility, best practices. Use `next/image` for images and minimal client JS where possible.

## Project structure

- `app/` – Next.js App Router (layout, page, admin routes, loading)
- `components/` – UI (Shadcn), sections (Hero, About, etc.), layout (Header, Footer), admin (guard, seed button)
- `contexts/` – AuthContext (Firebase Auth + Firestore role)
- `hooks/` – useAuth, useAdmin, use-toast
- `lib/` – Firebase init, utils
- `services/` – Firestore/Storage services (settings, experiences, projects, skills, certifications, messages, storage)
- `types/` – Firestore types
- `firestore.rules`, `storage.rules` – Firebase security rules

## License

Private / use as you wish.
