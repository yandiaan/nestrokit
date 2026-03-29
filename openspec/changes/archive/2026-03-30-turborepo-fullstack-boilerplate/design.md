## Context

This is a greenfield boilerplate project for solo developers who need a versatile starting point for full-stack TypeScript applications. The target users work on:
- Personal projects (experimentation, learning)
- Hackathons (speed, MVP focus)
- Freelance work (maintainability, professional handoff)

Current constraints:
- Must be modular enough to strip down to frontend-only or backend-only
- Must follow SOLID principles and functional programming patterns
- Must use latest stable dependency versions for security
- Must work on Windows, macOS, and Linux development environments

## Goals / Non-Goals

**Goals:**
- Provide a production-ready monorepo structure with Turborepo + pnpm
- Enable type-safe end-to-end development from database to UI
- Implement fp-ts patterns for explicit error handling in domain logic
- Auto-generate typed API clients from OpenAPI specs
- Include scaffold CLI for quick project customization
- Configure Docker for both development and production
- Set up security tooling (audits, auto-updates, runtime protection)

**Non-Goals:**
- Unit test setup (deferred to later iteration per user preference)
- Mobile app support (React Native)
- GraphQL or tRPC (REST + OpenAPI chosen)
- Multi-tenant architecture
- Microservices (single API, monolith-first approach)
- CI/CD for specific cloud providers (generic GitHub Actions only)

## Decisions

### 1. Monorepo Tooling: Turborepo + pnpm

**Decision**: Use Turborepo with pnpm workspaces

**Alternatives considered**:
- Nx: More powerful but steeper learning curve, heavier
- Lerna: Legacy, less maintained, slower
- Plain pnpm workspaces: No task orchestration or caching

**Rationale**: Turborepo provides fast caching and task orchestration with minimal configuration. Sweet spot between simplicity and power for solo dev.

### 2. Frontend Framework: Astro with Svelte Islands

**Decision**: Astro as main framework with Svelte components via islands architecture

**Alternatives considered**:
- Next.js: Heavier, RSC complexity, overkill for many projects
- React islands: Larger bundle size, more boilerplate
- SvelteKit standalone: Loses Astro's static optimization benefits

**Rationale**: Astro's islands architecture allows shipping minimal JS by default while enabling Svelte for interactive parts. Svelte compiles to vanilla JS with smaller bundle sizes than React. File-based routing is simple and intuitive.

### 3. State Management: Svelte Stores

**Decision**: Use Svelte's built-in stores for client-side state

**Alternatives considered**:
- Nanostores: Framework-agnostic but adds dependency
- Custom event bus: More manual, less type-safe
- Context API: Svelte has this but stores are simpler

**Rationale**: Svelte stores are built-in, zero-dependency, reactive by default, and integrate seamlessly with Svelte components. Writable, readable, and derived stores cover all common patterns.

### 4. Backend Framework: NestJS

**Decision**: Use NestJS with feature-based module structure

**Alternatives considered**:
- Express/Fastify: Less structure, more boilerplate for large apps
- Hono: Lighter but less ecosystem
- tRPC: Great but diverges from REST standard

**Rationale**: NestJS provides excellent structure, dependency injection, and ecosystem (Swagger, validation, guards). Feature-based modules align with SOLID principles.

### 5. API Communication: REST + OpenAPI + orval

**Decision**: REST API with Swagger/OpenAPI documentation, orval for client generation

**Alternatives considered**:
- GraphQL: More complex, overkill for most solo projects
- tRPC: Excellent DX but non-standard, harder to expose publicly

**Rationale**: REST is widely understood, OpenAPI provides documentation, and orval generates fully-typed clients automatically. Best balance of standard API + type safety.

### 6. Functional Programming: fp-ts at Domain Layer

**Decision**: Use fp-ts (Either, Option, TaskEither, pipe) for domain logic, plain TypeScript at boundaries

**Alternatives considered**:
- Effect: More powerful but much steeper learning curve
- Plain TypeScript: Less explicit error handling
- Full fp-ts everywhere: Too much ceremony at HTTP layer

**Rationale**: fp-ts at domain layer provides explicit error handling and composability. NestJS controllers convert fp-ts types to HTTP responses at the boundary.

**Implementation pattern**:
```
Controller (NestJS) → Service (fp-ts TE) → Repository (fp-ts TE) → Prisma
     ↓                      ↓                     ↓
  HTTP response      Domain errors          DB errors
     ↑                      ↑                     ↑
  unwrapOrThrow      TaskEither chain      TaskEither.tryCatch
```

### 7. Database: Prisma + PostgreSQL

**Decision**: Prisma ORM with PostgreSQL database

**Alternatives considered**:
- Drizzle: Lighter, but less mature ecosystem
- TypeORM: More complex, decorator-heavy
- Kysely: More SQL, less ORM features

**Rationale**: Prisma has excellent DX, generates types automatically, and provides migrations. PostgreSQL is robust and feature-rich.

### 8. Caching: Redis via ioredis

**Decision**: Redis for caching with ioredis client

**Alternatives considered**:
- In-memory cache: Not persistent, doesn't scale
- Memcached: Less features than Redis

**Rationale**: Redis is industry standard, supports various data structures, and works well for session storage and API caching.

### 9. Authentication: JWT (Access + Refresh Tokens)

**Decision**: JWT-based auth with access and refresh token pattern

**Alternatives considered**:
- Session-based: Requires server state, less scalable
- OAuth only: More complex for simple auth needs

**Rationale**: JWT is stateless and scalable. Refresh token pattern balances security (short access token) with UX (long-lived refresh).

### 10. Scaffold CLI: Custom Node Script

**Decision**: Custom Node CLI using @clack/prompts, fs-extra, execa

**Alternatives considered**:
- Plop: Can't delete files, only generate
- Hygen: Same limitation
- Yeoman: Heavy, outdated

**Rationale**: Custom script allows full control over file deletion, package.json modification, and dependency cleanup. Written in TypeScript for consistency.

### 11. Styling: Tailwind CSS v4 with Plus Jakarta Sans

**Decision**: Tailwind CSS v4 with CSS-first configuration using `@theme` directive, Plus Jakarta Sans as primary font

**Alternatives considered**:
- Tailwind v3: Requires JS config, less modern CSS features
- Plain CSS: Less productive, no design system
- Other CSS frameworks: Less ecosystem, fewer utilities

**Rationale**: Tailwind v4 uses CSS-first configuration via `@theme` directive, enabling native CSS variables for all design tokens. Plus Jakarta Sans provides a modern, clean aesthetic with excellent readability. v4 also leverages modern CSS features like `oklch()` colors and cascade layers.

### 12. Package Structure

**Decision**: Monorepo packages organized by concern:

```
packages/
├── core/        # Domain types, schemas, fp-ts logic (shared)
├── database/    # Prisma client, repositories (backend)
├── api-client/  # Generated orval client (frontend)
├── ui/          # Svelte components, actions (frontend)
├── config/      # ESLint, TS, Tailwind configs (shared)
└── utils/       # Pure utility functions (shared)
```

**Rationale**: Clear separation allows scaffold CLI to cleanly remove frontend or backend packages. Each package has single responsibility.

## Risks / Trade-offs

### [Risk] fp-ts learning curve
**Mitigation**: Provide clear examples in boilerplate, limit fp-ts to domain layer, include helper utilities in @repo/utils.

### [Risk] Orval client generation may break on API changes
**Mitigation**: Version OpenAPI spec, run orval as part of build pipeline, type errors surface immediately.

### [Risk] Scaffold CLI may not handle all edge cases
**Mitigation**: Support common scenarios (frontend-only, backend-only, full-stack). Document manual steps for unusual configurations.

### [Risk] Docker complexity for simple projects
**Mitigation**: Make Docker optional. Provide scripts for running Postgres/Redis locally or using cloud services.

### [Risk] Latest dependencies may have breaking changes
**Mitigation**: Use caret (^) versions for auto minor/patch updates. Renovate configured for PR-based major updates with review.

### [Trade-off] REST over tRPC
**Trade-off accepted**: Lose some type inference convenience, but gain standard API that can be consumed by any client (mobile, external parties).

### [Trade-off] Monolith over microservices
**Trade-off accepted**: Single deployable unit is simpler for solo dev. Can extract services later if needed.
