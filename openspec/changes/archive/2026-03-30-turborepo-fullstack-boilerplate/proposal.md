## Why

Solo developers need a production-ready monorepo boilerplate that works across personal projects, hackathons, and freelance work. Current options are either too minimal (requiring significant setup) or too opinionated (hard to customize). This boilerplate provides a modular, SOLID-principled architecture with functional programming patterns, plus a scaffold CLI to quickly strip down to just frontend or backend when needed.

## What Changes

- Create Turborepo + pnpm workspace monorepo structure
- Set up Astro frontend with Svelte islands, Svelte stores, and Tailwind CSS
- Set up NestJS backend with Prisma ORM and Redis caching
- Implement fp-ts integration for domain logic (TaskEither, Option, Either)
- Configure REST API with OpenAPI/Swagger and orval client generation
- Implement JWT authentication (access + refresh tokens)
- Create shared packages (core, database, api-client, ui, config, utils)
- Build scaffold CLI for project customization (remove frontend/backend/features)
- Configure Docker for development (Postgres + Redis) and production
- Set up security tooling (Renovate, audit scripts, Helmet, CORS, rate-limiting)
- Use latest stable versions of all dependencies

## Capabilities

### New Capabilities

- `monorepo-structure`: Turborepo + pnpm workspace configuration with apps and packages organization
- `frontend-astro`: Astro application with Svelte islands, file-based routing, Svelte stores state management, and Tailwind CSS
- `backend-nestjs`: NestJS application with modular feature-based architecture, Prisma ORM, and Redis caching
- `shared-core`: Shared domain logic package with fp-ts patterns, Zod schemas, branded types, and domain errors
- `shared-database`: Prisma client wrapper with repository pattern using fp-ts TaskEither
- `shared-api-client`: Auto-generated typed API client using orval from OpenAPI spec
- `shared-ui`: Reusable Svelte components and actions for Astro islands
- `shared-config`: Centralized ESLint, TypeScript, and Tailwind configurations
- `shared-utils`: Pure utility functions and fp-ts helpers
- `auth-jwt`: JWT authentication with access/refresh tokens, guards, and decorators
- `scaffold-cli`: Interactive CLI tool for project customization (remove apps/packages/features)
- `docker-setup`: Docker Compose configurations for development and production environments
- `security-tooling`: Dependency auditing, Renovate auto-updates, and runtime security middleware

### Modified Capabilities

<!-- No existing capabilities - this is a greenfield boilerplate -->

## Impact

- **New Files**: ~100+ files across apps, packages, tools, and configs
- **Dependencies**: Latest versions of Astro, NestJS, Prisma, Svelte, Tailwind, fp-ts, Zod, and related packages
- **Infrastructure**: Docker Compose for Postgres and Redis
- **CI/CD**: GitHub Actions workflows for linting, type-checking, and deployment
- **Developer Experience**: Single command setup, typed end-to-end, hot reload across monorepo
