# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with hot-reload (ts-node-dev)
npm run build      # Compile TypeScript to dist/
npm start          # Start production server from dist/
npm test           # Run all Jest tests
npm run db:seed    # Seed database with sample data
npm run db:migrate # Run Prisma migrations
npm run db:generate # Regenerate Prisma client
npm run db:studio  # Open Prisma Studio (DB GUI)
```

- Tests use Jest + Supertest with mocked Prisma. Test files are in `tests/*.test.ts`.
- Run a single test file: `npx jest tests/auth.test.ts --verbose`

## Architecture

**Layer pattern**: Routes → Middleware → Controllers → Services → Repositories → Prisma → SQL Server

### Layer responsibilities

- **Routes** (`src/routes/v1/`): Define HTTP methods/paths, wire middleware (auth, validate) and controllers. All mounted under `/api/v1` via `src/routes/index.ts`.
- **Middleware** (`src/middleware/`):
  - `auth.ts`: JWT verification + role-based authorization (`authenticate`, `authorize`)
  - `validate.ts`: Zod schema validation for `body/query/params`
  - `errorHandler.ts`: Global catch-all, handles `AppError`, `ZodError`, and unexpected errors
- **Controllers** (`src/controllers/`): Thin layer — extract request data, call service, send response via `ApiResponse` helpers. No business logic.
- **Services** (`src/services/`): Business logic only. Throw custom errors (`UnauthorizedError`, `BadRequestError`, `ConflictError` etc. from `utils/apiResponse.ts`).
- **Repositories** (`src/repositories/`): Database access via Prisma. Only repository layer imports `prisma` directly.
- **Validators** (`src/validators/`): Zod schemas exported as named exports, consumed by `validate` middleware. Each schema wraps `{ body, query, params }` objects.

### Error handling

Custom error classes in `src/utils/apiResponse.ts`: `AppError` (base), `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409), `InternalServerError` (500). Errors thrown from services are caught by controllers and forwarded to the global `errorHandler`.

### API response format

All successful responses follow: `{ success: true, message: string, data: T | null }` via `ApiResponse.success()` or `ApiResponse.created()`.

### Authentication

- JWT tokens in `Authorization: Bearer <token>` header
- After verification, `req.user` is populated with `{ id, email, role, fullName, actorId }`
- The `actorId` is the ID from the role-specific table (e.g., `Teacher.id`, `Student.id`)
- Types extended via `src/types/express.d.ts`

### Database

- **Provider**: PostgreSQL (configured in `prisma/schema.prisma`), with Vietnamese table/column names mapped via `@map` and `@@map`
- **Enums**: Prisma's SQL Server connector doesn't support DB-level enums. "Enums" are string columns with monkey-patched runtime constants in `src/config/prisma.ts` (imported as `UserRole`, `SubmissionStatus`)
- The monkey-patch must be applied **before** any module imports `@prisma/client` — `src/app.ts` imports `./config/prisma` first
- Seed script in `prisma/seed.ts` uses the same monkey-patch pattern

### Existing modules (all under `/api/v1`)

| Module | Routes | Key Entities |
|--------|--------|-------------|
| Auth | `/auth` | login, change-password, forgot-password, reset-password |
| User | `/users` | profile CRUD, admin user management |
| Academic | `/academic` | terms, classes, subjects, assignments |
| Rubric | `/rubrics` | rubric and criteria CRUD |
| Group | `/groups` | student groups/topics |
| Submission | `/submissions` | submit, resubmit, status transitions |
| Grade | `/grades` | grading with detailed scores |
| Comment | `/comments` | submission comments (UC-22) |
| EditRequest | `/edit-requests` | teacher edit requests (UC-10) |
| Notification | `/notifications` | in-app notifications |
| System | `/system` | configs, logs, backups |

### Optimistic concurrency (OCC)

`Submission` and `Grade` models have a `version` field. Updates increment the version and use `version` in the `where` clause — if the version doesn't match (another request modified the record first), the update fails.

### Key conventions

- All Vietnamese UI messages use `Tiếng Việt` (no diacritics for file/table names, full diacritics for user-facing messages)
- Controllers and services are instantiated as singletons and exported: `export const authController = new AuthController()`
- Repository layer always includes role-specific relations (`admin`, `teacher`, `student`, `academicDept`) when querying users
- Routes chain middleware: `authenticate` → (optional) `authorize(...roles)` → `validate(schema)` → `controller.method`
