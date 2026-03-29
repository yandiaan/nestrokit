## ADDED Requirements

### Requirement: Package location and generated client
The api-client package SHALL be located at packages/api-client/ with generated code in src/generated/.

#### Scenario: Package structure
- **WHEN** developer navigates to packages/api-client/
- **THEN** orval config and generated client code are present

### Requirement: Orval configuration
The package SHALL include orval.config.ts for generating typed client from OpenAPI spec.

#### Scenario: Config location
- **WHEN** developer checks orval configuration
- **THEN** orval.config.ts exists with proper input/output settings

### Requirement: Client generation from OpenAPI
Running generation script SHALL produce typed API client from backend's OpenAPI spec.

#### Scenario: Generate client
- **WHEN** developer runs `pnpm --filter @repo/api-client generate`
- **THEN** typed client is generated from /api/docs-json endpoint

### Requirement: Typed API functions
Generated client SHALL provide fully typed functions for each API endpoint.

#### Scenario: Endpoint typing
- **WHEN** developer calls generated API function
- **THEN** request parameters and response are fully typed

#### Scenario: Autocomplete support
- **WHEN** developer types API call
- **THEN** IDE provides autocomplete for endpoints, params, and responses

### Requirement: Fetch-based implementation
Generated client SHALL use fetch API for HTTP requests (no axios dependency).

#### Scenario: Request execution
- **WHEN** API function is called
- **THEN** fetch is used to make HTTP request

### Requirement: Custom instance support
Generated client SHALL support custom fetch instance for auth headers and base URL.

#### Scenario: Auth header injection
- **WHEN** API client is configured with auth token
- **THEN** all requests include Authorization header

#### Scenario: Base URL configuration
- **WHEN** API client is initialized with base URL
- **THEN** all requests use configured base URL
