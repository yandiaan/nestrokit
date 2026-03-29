# Nestrokit

A production-ready full-stack boilerplate built with modern technologies and best practices.

## Tech Stack

### Frontend
- **[Astro](https://astro.build)** - Static-first web framework with partial hydration
- **[Svelte 5](https://svelte.dev)** - Reactive UI components as islands
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework

### Backend
- **[NestJS](https://nestjs.com)** - Enterprise Node.js framework
- **[Prisma](https://prisma.io)** - Type-safe ORM
- **[PostgreSQL](https://postgresql.org)** - Relational database
- **[Redis](https://redis.io)** - Caching and sessions

### Architecture
- **[Turborepo](https://turbo.build)** - High-performance monorepo build system
- **[pnpm](https://pnpm.io)** - Fast, disk-efficient package manager
- **[fp-ts](https://gcanti.github.io/fp-ts/)** - Functional programming utilities
- **[Zod](https://zod.dev)** - Schema validation

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL and Redis)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nestrokit.git
cd nestrokit

# Install dependencies
pnpm install

# Start Docker services (PostgreSQL + Redis)
docker compose up -d

# Setup database
pnpm db:generate
pnpm db:push

# Start development servers
pnpm dev
```

### Development URLs

- **Frontend**: http://localhost:4321
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs

## Project Structure

```
nestrokit/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── database/    # Prisma integration
│   │   │   ├── modules/     # Feature modules
│   │   │   │   ├── auth/    # Authentication
│   │   │   │   ├── cache/   # Redis caching
│   │   │   │   ├── health/  # Health checks
│   │   │   │   └── user/    # User CRUD
│   │   │   └── shared/      # Pipes, filters, interceptors
│   │   └── package.json
│   │
│   └── web/                 # Astro frontend
│       ├── src/
│       │   ├── components/  # Svelte islands
│       │   ├── layouts/     # Astro layouts
│       │   ├── pages/       # Astro pages
│       │   └── stores/      # Svelte stores
│       └── package.json
│
├── packages/
│   ├── api-client/          # Generated API client (orval)
│   ├── config/              # Shared configurations
│   │   ├── eslint/          # ESLint configs
│   │   ├── tailwind/        # Tailwind preset
│   │   └── typescript/      # TypeScript configs
│   ├── core/                # Domain types, errors, schemas
│   ├── database/            # Prisma schema & repositories
│   ├── ui/                  # Svelte UI components
│   └── utils/               # Utility functions (fp-ts)
│
├── tools/
│   └── scaffold/            # Project customization CLI
│
├── docker/
│   ├── Dockerfile.api       # API production build
│   ├── Dockerfile.web       # Web production build
│   └── nginx.conf           # Production nginx config
│
├── docker-compose.yml       # Development services
├── docker-compose.prod.yml  # Production stack
├── turbo.json              # Turborepo config
└── pnpm-workspace.yaml     # Workspace config
```

## Available Scripts

### Root Commands

```bash
# Development
pnpm dev                  # Start all apps in development
pnpm build               # Build all apps
pnpm lint                # Lint all packages
pnpm typecheck           # Type-check all packages
pnpm format              # Format code with Prettier
pnpm clean               # Clean all build artifacts

# Database
pnpm db:generate         # Generate Prisma client
pnpm db:migrate:dev      # Run development migrations
pnpm db:migrate:deploy   # Run production migrations
pnpm db:push             # Push schema to database
pnpm db:studio           # Open Prisma Studio

# Individual Apps
pnpm api:dev             # Start API in development
pnpm api:build           # Build API
pnpm web:dev             # Start web in development
pnpm web:build           # Build web

# Utilities
pnpm generate:api-client # Generate API client from OpenAPI
pnpm scaffold            # Run scaffold CLI
pnpm deps:check          # Check for outdated packages
pnpm deps:update         # Update all packages
pnpm deps:audit          # Security audit
```

## Scaffold CLI

Customize the boilerplate for your project needs:

```bash
pnpm scaffold
```

Options:
- **Full-stack**: Keep everything
- **Frontend only**: Remove API and database
- **Backend only**: Remove web app
- **Custom**: Choose what to keep/remove

Use `pnpm scaffold --dry-run` to preview changes.

## Authentication

JWT-based authentication with access and refresh tokens:

```typescript
// Login
POST /api/auth/login
{ "email": "user@example.com", "password": "..." }

// Register
POST /api/auth/register
{ "email": "...", "password": "...", "name": "..." }

// Refresh tokens
POST /api/auth/refresh
{ "refreshToken": "..." }

// Get current user
GET /api/auth/me
Authorization: Bearer <accessToken>
```

### Protected Routes

All routes are protected by default. Use decorators to customize:

```typescript
@Public()           // Skip authentication
@Roles('ADMIN')     // Require specific role
@CurrentUser()      // Get authenticated user
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestrokit

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# API
PORT=3001
CORS_ORIGIN=http://localhost:4321

# Frontend
PUBLIC_API_URL=http://localhost:3001/api
```

## Docker Deployment

### Development

```bash
# Start PostgreSQL and Redis
docker compose up -d
```

### Production

```bash
# Build and start all services
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

Required environment variables for production:
- `POSTGRES_PASSWORD`
- `REDIS_PASSWORD`
- `JWT_SECRET`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm lint` and `pnpm typecheck`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) for details.
