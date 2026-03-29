## ADDED Requirements

### Requirement: Auth module location
The authentication module SHALL be located at apps/api/src/modules/auth/.

#### Scenario: Module structure
- **WHEN** developer navigates to auth module
- **THEN** controller, service, module, strategies, and guards are present

### Requirement: JWT access token
The system SHALL issue short-lived JWT access tokens for API authentication.

#### Scenario: Token generation
- **WHEN** user successfully authenticates
- **THEN** JWT access token is issued with configurable expiry (default 15 minutes)

#### Scenario: Token content
- **WHEN** access token is decoded
- **THEN** payload contains userId and any required claims

### Requirement: JWT refresh token
The system SHALL issue long-lived refresh tokens for obtaining new access tokens.

#### Scenario: Refresh token generation
- **WHEN** user successfully authenticates
- **THEN** refresh token is issued with configurable expiry (default 7 days)

#### Scenario: Token refresh
- **WHEN** valid refresh token is presented to /auth/refresh
- **THEN** new access token is issued

### Requirement: JWT authentication guard
The system SHALL provide a guard for protecting routes requiring authentication.

#### Scenario: Valid token
- **WHEN** request includes valid access token in Authorization header
- **THEN** request proceeds to controller with user context

#### Scenario: Missing token
- **WHEN** request has no Authorization header
- **THEN** 401 Unauthorized is returned

#### Scenario: Invalid token
- **WHEN** request includes invalid or expired access token
- **THEN** 401 Unauthorized is returned

### Requirement: Current user decorator
The system SHALL provide @CurrentUser() decorator to access authenticated user in controllers.

#### Scenario: User injection
- **WHEN** controller method uses @CurrentUser() decorator
- **THEN** authenticated user object is injected as parameter

### Requirement: JWT strategy configuration
JWT secret and expiry times SHALL be configurable via environment variables.

#### Scenario: Configuration
- **WHEN** application starts
- **THEN** JWT settings are loaded from JWT_SECRET, JWT_ACCESS_EXPIRY, JWT_REFRESH_EXPIRY env vars

### Requirement: Login endpoint
The system SHALL expose POST /auth/login for username/password authentication.

#### Scenario: Successful login
- **WHEN** valid credentials are provided
- **THEN** access token and refresh token are returned

#### Scenario: Invalid credentials
- **WHEN** invalid credentials are provided
- **THEN** 401 Unauthorized is returned

### Requirement: Logout endpoint
The system SHALL expose POST /auth/logout for token invalidation.

#### Scenario: Logout
- **WHEN** authenticated user calls /auth/logout
- **THEN** refresh token is invalidated
