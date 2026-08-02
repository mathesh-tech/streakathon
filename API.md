# STREAKATHON API Documentation

This application heavily utilizes Next.js Server Actions for data mutation and form handling, ensuring full type safety between the client and server. For background jobs and webhooks, traditional REST API endpoints are used.

## Server Actions (`/actions`)

Server actions act as RPC (Remote Procedure Call) endpoints. They are the primary method of interaction for the UI.

### Authentication (`actions/auth.ts`)
- `login(data)`: Authenticate a user and create a session.
- `register(data)`: Create a new user account (Student/Ambassador).

### Team Management (`actions/team.ts`)
- `createTeam(teamName, leaderId, hackathonId)`: Initialize a new team.
- `submitProject(teamId, githubLink, pptFile)`: Submit project deliverables.

### Attendance (`actions/attendance.ts`)
- `markAttendance(studentId, hackathonId, status)`: Mark individual attendance (Admin/Ambassador).
- `markBulkAttendance(studentIds, hackathonId, status)`: Mark attendance for multiple students.

### Credits & Leaderboard (`actions/credits.ts`)
- `awardCredits(studentId, amount, reason)`: Manually award innovation credits.
- `redeemCredits(studentId, amount, rewardId)`: Redeem credits for rewards.

---

## REST Endpoints (`/app/api`)

### Health Check
- **`GET /api/health`**
  - **Description**: Returns the operational status of the application and database.
  - **Response (200 OK)**:
    ```json
    {
      "uptime": 12345,
      "status": "OK",
      "services": {
        "database": "OK",
        "authentication": "OK"
      }
    }
    ```

### Cron Jobs (`/api/cron/*`)
These endpoints are secured via the `CRON_SECRET` environment variable and are triggered by Vercel Cron.

- **`GET /api/cron/lock-teams`**: Locks teams that have reached capacity or deadline.
- **`GET /api/cron/reports`**: Processes and emails scheduled analytics reports to administrators.
- **`GET /api/cron/scheduler`**: Sends out automated reminders for upcoming hackathons.
