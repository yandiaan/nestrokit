## ADDED Requirements

### Requirement: Package location and exports
The utils package SHALL be located at packages/utils/ with utilities exported from src/index.ts.

#### Scenario: Package import
- **WHEN** code imports from @repo/utils
- **THEN** all public utility functions are accessible

### Requirement: fp-ts helper utilities
The package SHALL provide helper functions for common fp-ts patterns in src/fp/.

#### Scenario: TaskEither helpers
- **WHEN** developer needs common TE operations
- **THEN** helpers are available (e.g., unwrapOrThrow, sequenceArray)

#### Scenario: Option helpers
- **WHEN** developer needs Option conversions
- **THEN** helpers are available (e.g., fromNullable, toUndefined)

### Requirement: Common utility functions
The package SHALL provide pure utility functions in src/common/ for string, date, and general operations.

#### Scenario: String utilities
- **WHEN** developer needs string manipulation
- **THEN** functions available (slugify, truncate, capitalize, etc.)

#### Scenario: Date utilities
- **WHEN** developer needs date formatting
- **THEN** functions available (formatDate, parseDate, etc.)

### Requirement: Pure function implementations
All utility functions SHALL be pure with no side effects.

#### Scenario: Function purity
- **WHEN** utility function is called with same inputs
- **THEN** same output is always returned

### Requirement: Full TypeScript typing
All utility functions SHALL have complete TypeScript type definitions.

#### Scenario: Type inference
- **WHEN** developer uses utility function
- **THEN** return type is correctly inferred

### Requirement: Tree-shakeable exports
The package SHALL support tree-shaking for minimal bundle size.

#### Scenario: Selective import
- **WHEN** consumer imports single utility
- **THEN** only that utility is bundled (no side effects)
