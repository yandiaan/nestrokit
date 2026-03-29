## ADDED Requirements

### Requirement: Package location and config exports
The config package SHALL be located at packages/config/ with configs organized by tool (eslint/, typescript/, tailwind/).

#### Scenario: Package structure
- **WHEN** developer navigates to packages/config/
- **THEN** subdirectories for each tool config are present

### Requirement: ESLint base configuration
The package SHALL provide base ESLint config extendable by all workspaces.

#### Scenario: Base config extension
- **WHEN** workspace extends @repo/config/eslint/base
- **THEN** common linting rules are applied

### Requirement: ESLint Svelte configuration
The package SHALL provide Svelte-specific ESLint config for frontend workspaces.

#### Scenario: Svelte config extension
- **WHEN** frontend workspace extends @repo/config/eslint/svelte
- **THEN** Svelte linting rules are applied

### Requirement: ESLint NestJS configuration
The package SHALL provide NestJS-specific ESLint config for backend workspaces.

#### Scenario: NestJS config extension
- **WHEN** backend workspace extends @repo/config/eslint/nest
- **THEN** NestJS-specific linting rules are applied

### Requirement: TypeScript base configuration
The package SHALL provide base tsconfig.json extendable by all workspaces.

#### Scenario: Base tsconfig extension
- **WHEN** workspace extends @repo/config/typescript/base.json
- **THEN** common TypeScript settings are applied

### Requirement: TypeScript Svelte configuration
The package SHALL provide Svelte-specific tsconfig for frontend workspaces.

#### Scenario: Svelte tsconfig extension
- **WHEN** frontend extends @repo/config/typescript/svelte.json
- **THEN** Svelte-specific settings are applied

### Requirement: TypeScript Node configuration
The package SHALL provide Node-specific tsconfig for backend workspaces.

#### Scenario: Node tsconfig extension
- **WHEN** backend extends @repo/config/typescript/node.json
- **THEN** Node-specific settings are applied

### Requirement: Tailwind preset
The package SHALL provide Tailwind CSS preset with common theme configuration.

#### Scenario: Preset usage
- **WHEN** workspace uses @repo/config/tailwind/preset
- **THEN** common theme, colors, and plugins are available
