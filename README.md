# STREAKATHON - Continuous Innovation Platform

![STREAKATHON](/sona-logo.png)

STREAKATHON is a premium, enterprise-grade Hackathon Management and University Innovation Platform. It is designed to track student participation, award innovation credits, manage teams, handle submissions, evaluate projects, and provide comprehensive analytics through beautifully crafted, mobile-first dashboards.

## Features

*   **Role-Based Access Control (RBAC):** Distinct portals for Students, Ambassadors, Evaluators, and Administrators.
*   **Team Management:** Create, join, and manage teams seamlessly.
*   **Real-time Leaderboards:** Gamified innovation credits system with dynamic rankings.
*   **Attendance & Evaluation:** Secure attendance tracking and rigorous project evaluation flows.
*   **Certificate Generation:** Automated certificate generation and verification.
*   **Analytics Dashboard:** Business Intelligence module for administrators to track metrics.
*   **Production Ready:** Built with Clean Architecture, fully typed, SEO optimized, and PWA ready.

## Tech Stack

*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Framer Motion
*   **Database:** PostgreSQL (via Prisma ORM)
*   **Authentication:** NextAuth.js
*   **UI Components:** Radix UI, Lucide Icons

## Folder Structure

```
.
├── actions/             # Server Actions (Application Layer)
├── app/                 # Next.js App Router (Presentation Layer)
├── components/          # Reusable UI Components
├── lib/                 # Shared utilities, Prisma client, NextAuth config
├── prisma/              # Database schema and migrations
├── public/              # Static assets (images, fonts, manifest)
├── server/              # Backend core (Clean Architecture)
│   ├── repositories/    # Database access layer
│   ├── services/        # Business logic layer
│   └── utils/           # Server utilities (Events, Email Templates)
└── README.md
```

## Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL database

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-org/streakathon.git
    cd streakathon
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    ```bash
    cp .env.example .env
    ```
    *Update `.env` with your PostgreSQL database URL and generated `NEXTAUTH_SECRET`.*
4.  Run Prisma Migrations:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  Start the development server:
    ```bash
    npm run dev
    ```

## Deployment (Vercel)

1.  Connect your GitHub repository to Vercel.
2.  Set the Environment Variables in the Vercel Dashboard (copy from your `.env`).
3.  Set the Build Command to `npx prisma generate && next build`.
4.  Deploy.

## Documentation

*   [API Documentation](./API.md)
*   [Database Schema Documentation](./DATABASE.md)

## License
MIT License. See `LICENSE` for more information.
