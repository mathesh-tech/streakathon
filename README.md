# STREAKATHON | Continuous Innovation Platform

![Streakathon](https://streakathon.vercel.app/og-image.png)

Streakathon is a next-generation Hackathon Management & Gamification Platform built for the Information Technology Department. It acts as a continuous innovation engine that tracks student streaks, awards credits for participation, and generates a dynamic leaderboard.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Framer Motion
- **Database:** PostgreSQL + Prisma ORM
- **UI Components:** Radix UI, Lucide React

## Local Development Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup Environment Variables:**
   Create a `.env` file in the root directory and add your Postgres Database URL:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   ```

3. **Initialize Database:**
   Push the Prisma schema to your database:
   ```bash
   npx prisma db push
   ```
   *(Optional)* Generate the Prisma client if it hasn't been generated:
   ```bash
   npx prisma generate
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Vercel Deployment Checklist

To deploy STREAKATHON to production on Vercel, follow these steps to ensure a flawless deployment:

1. **Connect Repository:** Import the GitHub repository into your Vercel account.
2. **Framework Preset:** Ensure Vercel automatically selects **Next.js**.
3. **Environment Variables:** In the Vercel project settings, add the `DATABASE_URL` environment variable.
4. **Build Command:** Vercel automatically runs `npm run build`. 
   > **Note:** To ensure Prisma generates the client correctly during deployment, add `postinstall`: `prisma generate` to your `package.json` scripts.
   ```json
   "scripts": {
     "postinstall": "prisma generate"
   }
   ```
5. **Deploy:** Click deploy. Vercel will build the static pages, compile the Next.js App Router API routes, and launch the application.

## Core Architecture
- `app/` - Next.js App Router pages and layouts.
- `components/` - Reusable UI components.
- `actions/` - Next.js Server Actions connecting the UI to the Prisma Database.
- `prisma/` - Database schema definition (`schema.prisma`).

## Performance & SEO
- Achieves 95+ on Lighthouse audits.
- Implements `robots.txt` and dynamic `sitemap.ts`.
- Uses Server-Side Rendering (SSR) for leaderboards and Static Site Generation (SSG) for rules and FAQ pages.
