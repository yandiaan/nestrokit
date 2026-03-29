## ADDED Requirements

### Requirement: Package location and Prisma schema
The database package SHALL be located at packages/database/ with Prisma schema at prisma/schema.prisma.

#### Scenario: Package structure
- **WHEN** developer navigates to packages/database/
- **THEN** Prisma schema and client exports are present

### Requirement: Singleton Prisma client
The package SHALL export a singleton PrismaClient instance to prevent connection pool exhaustion.

#### Scenario: Client import
- **WHEN** multiple modules import Prisma client
- **THEN** same instance is reused across all imports

### Requirement: fp-ts TaskEither for database operations
Database operations SHALL return TaskEither<DomainError, T> for explicit async error handling.

#### Scenario: Successful query
- **WHEN** database query succeeds
- **THEN** Right<T> is returned with query result

#### Scenario: Query error
- **WHEN** database query fails
- **THEN** Left<DomainError> is returned with mapped error

### Requirement: Base repository pattern
The package SHALL provide a base repository class/functions for common CRUD operations.

#### Scenario: FindById operation
- **WHEN** repository.findById(id) is called
- **THEN** TaskEither<DomainError, Option<T>> is returned

#### Scenario: Create operation
- **WHEN** repository.create(data) is called
- **THEN** TaskEither<DomainError, T> is returned with created entity

#### Scenario: Update operation
- **WHEN** repository.update(id, data) is called
- **THEN** TaskEither<DomainError, T> is returned with updated entity

#### Scenario: Delete operation
- **WHEN** repository.delete(id) is called
- **THEN** TaskEither<DomainError, void> is returned

### Requirement: Error mapping from Prisma
Prisma errors SHALL be mapped to domain errors (NotFoundError, ValidationError, etc.).

#### Scenario: Record not found
- **WHEN** Prisma throws P2025 (record not found)
- **THEN** NotFoundError is returned

#### Scenario: Unique constraint violation
- **WHEN** Prisma throws P2002 (unique constraint)
- **THEN** ValidationError is returned with field info

### Requirement: Migration support
Prisma migrations SHALL be managed via package scripts.

#### Scenario: Create migration
- **WHEN** developer runs `pnpm --filter @repo/database migrate:dev`
- **THEN** new migration is created from schema changes

#### Scenario: Apply migrations
- **WHEN** developer runs `pnpm --filter @repo/database migrate:deploy`
- **THEN** pending migrations are applied to database
