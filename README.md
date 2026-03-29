<div align="center">
  <br />
  <h1>Nestrokit</h1>
  <p><strong>The Modern Full-Stack Monorepo Boilerplate</strong></p>
  <p>Build production-ready applications with Astro, Svelte, NestJS, and Prisma</p>
  <br />

  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)
  ![Node](https://img.shields.io/badge/Node.js-20+-green?logo=node.js&logoColor=white)
  ![License](https://img.shields.io/badge/License-MIT-yellow)
  ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

  <br />

  [Quick Start](#quick-start) · [Documentation](#documentation) · [Features](#features) · [Contributing](#contributing)

  <br />
</div>

---

## Why Nestrokit?

**Nestrokit** is an opinionated full-stack boilerplate designed for solo developers, small teams, and rapid prototyping. It combines battle-tested technologies with modern development practices.

- **🚀 Ship Fast** — Pre-configured monorepo with hot reload across all packages
- **🔒 Secure by Default** — JWT auth, rate limiting, CORS, and security headers included
- **📦 Modular Architecture** — Add or remove features with the scaffold CLI
- **🎯 Type-Safe End-to-End** — From database to frontend with zero runtime errors
- **⚡ Optimized Performance** — Turborepo caching, partial hydration, and tree shaking

---

## Features

<table>
<tr>
<td width="50%">

### Frontend
- **Astro 5** — Islands architecture with partial hydration
- **Svelte 5** — Reactive components with runes
- **Tailwind CSS 4** — CSS-first configuration
- **Type-safe API Client** — Auto-generated from OpenAPI

</td>
<td width="50%">

### Backend
- **NestJS 11** — Enterprise-grade Node.js framework
- **Prisma 6** — Type-safe database access
- **Redis** — Caching and session storage
- **Swagger/OpenAPI** — Auto-generated API docs

</td>
</tr>
<tr>
<td width="50%">

### Developer Experience
- **Turborepo** — Blazing fast builds with caching
- **pnpm Workspaces** — Efficient dependency management
- **ESLint + Prettier** — Consistent code style
- **Hot Module Reload** — Instant feedback loop

</td>
<td width="50%">

### Production Ready
- **Docker** — Multi-stage production builds
- **Health Checks** — Kubernetes-ready endpoints
- **Rate Limiting** — Built-in API protection
- **Renovate** — Automated dependency updates

</td>
</tr>
</table>

---

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker

### Installation

```bash
# Clone and install
git clone https://github.com/difrfrfif/nestrokit.git && cd nestrokit
pnpm install

# Start services and database
docker compose up -d
pnpm db:generate && pnpm db:push

# Launch development servers
pnpm dev
```

**That's it!** Open [localhost:4321](http://localhost:4321) for the frontend and [localhost:3001/docs](http://localhost:3001/docs) for API documentation.

---

## Project Structure

```
nestrokit/
├── apps/
│   ├── api/                 # NestJS REST API
│   └── web/                 # Astro + Svelte frontend
├── packages/
│   ├── api-client/          # Generated API client
│   ├── config/              # Shared configs (TS, ESLint, Tailwind)
│   ├── core/                # Domain types, errors, schemas
│   ├── database/            # Prisma schema & repositories
│   ├── ui/                  # Svelte component library
│   └── utils/               # FP utilities (fp-ts)
├── tools/
│   └── scaffold/            # Project customization CLI
└── docker/                  # Production Dockerfiles
```

---

## Documentation

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm scaffold` | Customize project structure |

### Environment Variables

Create `.env` in the project root:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nestrokit
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

See [`.env.example`](.env.example) for all available options.

### Authentication

JWT-based auth with access/refresh tokens:

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Scaffold CLI

Customize the boilerplate for your needs:

```bash
pnpm scaffold
```

Choose from presets or create a custom configuration:
- **Full-stack** — Keep everything
- **Frontend only** — Remove API and database packages
- **Backend only** — Remove web app and UI components

---

## Deployment

### Docker

```bash
# Production build
docker compose -f docker-compose.prod.yml up -d
```

Required production secrets:
- `POSTGRES_PASSWORD`
- `REDIS_PASSWORD`  
- `JWT_SECRET`

### Manual

```bash
pnpm build
pnpm --filter @repo/api start:prod
pnpm --filter @repo/web preview
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | [Astro](https://astro.build) | 5.x |
| UI | [Svelte](https://svelte.dev) | 5.x |
| Styling | [Tailwind CSS](https://tailwindcss.com) | 4.x |
| Backend | [NestJS](https://nestjs.com) | 11.x |
| ORM | [Prisma](https://prisma.io) | 6.x |
| Database | [PostgreSQL](https://postgresql.org) | 16 |
| Cache | [Redis](https://redis.io) | 7 |
| Build | [Turborepo](https://turbo.build) | 2.x |
| Package Manager | [pnpm](https://pnpm.io) | 9.x |
| Validation | [Zod](https://zod.dev) | 3.x |
| FP Utilities | [fp-ts](https://gcanti.github.io/fp-ts/) | 2.x |

---

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Fork, clone, and install
git clone https://github.com/YOUR_USERNAME/nestrokit.git
cd nestrokit && pnpm install

# Create a branch
git checkout -b feature/amazing-feature

# Make changes, then
pnpm lint && pnpm typecheck
git commit -m "feat: add amazing feature"
git push origin feature/amazing-feature
```

---

## License

MIT © [Nestrokit Contributors](https://github.com/difrfrfif/nestrokit/graphs/contributors)

---

<div align="center">
  <br />
  <p>
    <sub>Built with ❤️ for developers who ship fast</sub>
  </p>
  <br />
</div>
