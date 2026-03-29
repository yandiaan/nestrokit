## ADDED Requirements

### Requirement: Development Docker Compose
The project SHALL include docker-compose.yml for local development with Postgres and Redis.

#### Scenario: Start dev services
- **WHEN** developer runs `docker compose up -d`
- **THEN** Postgres and Redis containers start

#### Scenario: Service ports
- **WHEN** containers are running
- **THEN** Postgres is accessible on port 5432, Redis on port 6379

### Requirement: Production Docker Compose
The project SHALL include docker-compose.prod.yml for production deployment with all services.

#### Scenario: Production services
- **WHEN** docker-compose.prod.yml is used
- **THEN** API, web, Postgres, and Redis services are configured

### Requirement: API Dockerfile
The project SHALL include docker/Dockerfile.api for building production API image.

#### Scenario: Build API image
- **WHEN** `docker build -f docker/Dockerfile.api .` runs
- **THEN** optimized NestJS production image is built

#### Scenario: Multi-stage build
- **WHEN** Dockerfile.api is examined
- **THEN** multi-stage build is used (deps, build, prod stages)

### Requirement: Web Dockerfile
The project SHALL include docker/Dockerfile.web for building production Web image.

#### Scenario: Build web image
- **WHEN** `docker build -f docker/Dockerfile.web .` runs
- **THEN** optimized Astro production image is built

### Requirement: Environment configuration
Docker Compose files SHALL use .env file for configuration.

#### Scenario: Env file usage
- **WHEN** docker compose starts
- **THEN** variables from .env are loaded into containers

### Requirement: Volume persistence
Development compose SHALL persist Postgres data via named volume.

#### Scenario: Data persistence
- **WHEN** Postgres container is recreated
- **THEN** database data is preserved in volume

### Requirement: Health checks
Production compose SHALL include health checks for all services.

#### Scenario: Health monitoring
- **WHEN** services are running
- **THEN** Docker reports health status based on configured checks

### Requirement: Network configuration
Production compose SHALL create internal network for service communication.

#### Scenario: Service communication
- **WHEN** API needs to reach database
- **THEN** connection uses internal Docker network
