## ADDED Requirements

### Requirement: Renovate configuration
The project SHALL include renovate.json for automated dependency updates.

#### Scenario: Config presence
- **WHEN** Renovate bot is enabled on repository
- **THEN** renovate.json configures update behavior

#### Scenario: Auto-merge patches
- **WHEN** dependency has patch update
- **THEN** PR is auto-merged if CI passes

#### Scenario: Major update PRs
- **WHEN** dependency has major update
- **THEN** PR is created for manual review

### Requirement: Dependency audit script
The project SHALL include script for running pnpm audit with configurable severity level.

#### Scenario: Run audit
- **WHEN** developer runs `pnpm deps:audit`
- **THEN** pnpm audit runs with --audit-level=high

#### Scenario: CI audit
- **WHEN** CI pipeline runs
- **THEN** audit step fails build on high/critical vulnerabilities

### Requirement: Dependency check script
The project SHALL include script for checking outdated dependencies.

#### Scenario: Check outdated
- **WHEN** developer runs `pnpm deps:check`
- **THEN** list of outdated packages is displayed

### Requirement: Dependency update script
The project SHALL include script for updating all dependencies to latest.

#### Scenario: Update all
- **WHEN** developer runs `pnpm deps:update`
- **THEN** all dependencies are updated to latest versions

### Requirement: Helmet middleware
The API SHALL use Helmet middleware for setting security HTTP headers.

#### Scenario: Security headers
- **WHEN** API responds to request
- **THEN** response includes security headers (CSP, X-Frame-Options, etc.)

### Requirement: CORS configuration
The API SHALL have configurable CORS with whitelist of allowed origins.

#### Scenario: CORS config
- **WHEN** request comes from allowed origin
- **THEN** CORS headers allow the request

#### Scenario: CORS block
- **WHEN** request comes from disallowed origin
- **THEN** request is blocked by CORS

### Requirement: Rate limiting
The API SHALL implement rate limiting to prevent abuse.

#### Scenario: Under limit
- **WHEN** client makes requests under rate limit
- **THEN** requests are processed normally

#### Scenario: Over limit
- **WHEN** client exceeds rate limit
- **THEN** 429 Too Many Requests is returned

### Requirement: Environment variable validation
The API SHALL validate required environment variables at startup.

#### Scenario: Valid env
- **WHEN** all required env vars are present
- **THEN** application starts successfully

#### Scenario: Missing env
- **WHEN** required env var is missing
- **THEN** application fails to start with clear error message
