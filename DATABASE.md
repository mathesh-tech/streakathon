# Database Schema Documentation

STREAKATHON uses PostgreSQL as its primary database, orchestrated via Prisma ORM.

## Core Models

### `User`
- **Purpose**: Core identity model for authentication and authorization.
- **Roles**: `ADMIN`, `STUDENT`, `AMBASSADOR`, `EVALUATOR`.
- **Relations**: 1-to-1 with `StudentProfile` (if role is STUDENT), 1-to-many with `AuditLog`.

### `Hackathon`
- **Purpose**: Defines an innovation event.
- **Fields**: Title, Description, Dates (Registration, Start, End), Status (`DRAFT`, `REGISTRATION_OPEN`, `LIVE`, `COMPLETED`).
- **Relations**: 1-to-many with `Registration`, `Team`, `Submission`, `Certificate`.

### `Team`
- **Purpose**: Group of students participating in a Hackathon.
- **Fields**: Team Name, Status (`FORMING`, `OPEN`, `FULL`, `LOCKED`).
- **Relations**: Belongs to `Hackathon`, 1-to-many with `TeamMember`, `TeamInvitation`, 1-to-1 with `Submission`.

### `Submission`
- **Purpose**: Project deliverables submitted by a Team.
- **Fields**: GitHub Link, PPT URL, Video URL, Status (`DRAFT`, `SUBMITTED`, `EVALUATED`).
- **Relations**: Belongs to `Team`, 1-to-many with `Evaluation`.

### `Evaluation`
- **Purpose**: Rubric scores assigned by Evaluators to Submissions.
- **Fields**: Scores (Innovation, Technical, Design, Presentation), Total Score, Feedback.

### `CreditTransaction`
- **Purpose**: Ledger for all Innovation Credits awarded or deducted.
- **Fields**: Amount, Type (`AWARD`, `REDEEM`, `PENALTY`), Reason.
- **Relations**: Belongs to `StudentProfile`.

### `AuditLog`
- **Purpose**: Security and compliance tracking for administrative actions.
- **Fields**: Action, Entity Type, Entity ID, Metadata.

## Indexes
To ensure production scale performance, indexes have been added on:
- `UserId` across all profile relations.
- `HackathonId` across teams and registrations.
- `Status` fields for fast filtering.

*For exact schema definitions, refer to `prisma/schema.prisma`.*
