## ADDED Requirements

### Requirement: Package location and exports
The core package SHALL be located at packages/core/ with barrel exports from src/index.ts.

#### Scenario: Package import
- **WHEN** code imports from @repo/core
- **THEN** all public types, schemas, and functions are accessible

### Requirement: Branded types for domain primitives
Domain primitives (Email, UserId, etc.) SHALL be implemented as branded types for type safety.

#### Scenario: Branded type creation
- **WHEN** developer creates a UserId
- **THEN** branded type prevents accidental mixing with other string types

#### Scenario: Type validation
- **WHEN** branded type is created via constructor function
- **THEN** validation runs before branding

### Requirement: Zod schemas for validation
All DTOs and domain objects SHALL have corresponding Zod schemas for runtime validation.

#### Scenario: DTO validation
- **WHEN** incoming data needs validation
- **THEN** Zod schema validates and returns typed result

#### Scenario: Schema inference
- **WHEN** developer needs TypeScript type from schema
- **THEN** z.infer<typeof schema> provides the type

### Requirement: Domain error types
Domain errors SHALL be defined as discriminated union with _tag property for pattern matching.

#### Scenario: Error creation
- **WHEN** domain logic encounters an error condition
- **THEN** appropriate DomainError variant is returned

#### Scenario: Error matching
- **WHEN** error handler receives DomainError
- **THEN** switch on _tag provides exhaustive handling

### Requirement: fp-ts Either for synchronous operations
Synchronous domain operations that can fail SHALL return Either<DomainError, T>.

#### Scenario: Validation success
- **WHEN** validation passes
- **THEN** Right<T> is returned with validated value

#### Scenario: Validation failure
- **WHEN** validation fails
- **THEN** Left<DomainError> is returned with error details

### Requirement: fp-ts Option for nullable values
Nullable domain values SHALL be represented as Option<T> instead of T | null.

#### Scenario: Value present
- **WHEN** optional value exists
- **THEN** Some<T> is returned

#### Scenario: Value absent
- **WHEN** optional value is missing
- **THEN** None is returned

### Requirement: fp-ts pipe for composition
Function composition SHALL use fp-ts pipe for readable left-to-right data flow.

#### Scenario: Pipeline execution
- **WHEN** multiple operations are composed
- **THEN** pipe executes them left-to-right

### Requirement: Pure domain functions
Domain logic functions SHALL be pure with no side effects.

#### Scenario: Function purity
- **WHEN** domain function is called with same inputs
- **THEN** same output is always returned without side effects
