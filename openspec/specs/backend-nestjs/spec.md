## ADDED Requirements

### Requirement: NestJS application structure
The backend app SHALL be located at apps/api/ with NestJS as the primary framework.

#### Scenario: App location
- **WHEN** developer navigates to apps/api/
- **THEN** NestJS application files are present with modular structure

### Requirement: Feature-based module organization
Backend code SHALL be organized by feature in src/modules/ with each feature as a self-contained module.

#### Scenario: Module structure
- **WHEN** developer creates a new feature
- **THEN** feature has its own directory with controller, service, module, and related files

#### Scenario: Module independence
- **WHEN** developer removes a feature module
- **THEN** other modules continue to function without modification

### Requirement: Shared utilities location
Cross-cutting concerns SHALL be placed in src/shared/ including decorators, filters, guards, interceptors, and pipes.

#### Scenario: Custom decorator usage
- **WHEN** controller needs custom decorator
- **THEN** decorator is imported from src/shared/decorators/

### Requirement: OpenAPI/Swagger documentation
The API SHALL expose OpenAPI documentation via Swagger at /api/docs endpoint.

#### Scenario: Swagger UI access
- **WHEN** developer navigates to /api/docs
- **THEN** interactive Swagger UI is displayed with all endpoints

#### Scenario: OpenAPI JSON
- **WHEN** client requests /api/docs-json
- **THEN** OpenAPI specification JSON is returned

### Requirement: Zod validation pipe
Request validation SHALL use Zod schemas via custom validation pipe.

#### Scenario: Valid request
- **WHEN** request body passes Zod schema validation
- **THEN** request proceeds to controller

#### Scenario: Invalid request
- **WHEN** request body fails Zod schema validation
- **THEN** 400 Bad Request is returned with validation errors

### Requirement: Domain exception filter
Domain errors from fp-ts SHALL be converted to HTTP responses via exception filter.

#### Scenario: ValidationError handling
- **WHEN** service returns Left with ValidationError
- **THEN** HTTP 400 Bad Request is returned

#### Scenario: NotFoundError handling
- **WHEN** service returns Left with NotFoundError
- **THEN** HTTP 404 Not Found is returned

#### Scenario: UnauthorizedError handling
- **WHEN** service returns Left with UnauthorizedError
- **THEN** HTTP 401 Unauthorized is returned

### Requirement: Logging interceptor
All requests SHALL be logged via interceptor including method, path, and duration.

#### Scenario: Request logging
- **WHEN** API receives a request
- **THEN** log entry includes method, path, status code, and response time

### Requirement: Health check endpoint
The API SHALL expose a health check endpoint at /health.

#### Scenario: Health check success
- **WHEN** client requests /health
- **THEN** 200 OK is returned with service status
