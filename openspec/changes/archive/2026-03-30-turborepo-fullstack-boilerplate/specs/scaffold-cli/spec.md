## ADDED Requirements

### Requirement: CLI tool location
The scaffold CLI SHALL be located at tools/scaffold/ with entry point at src/index.ts.

#### Scenario: Tool location
- **WHEN** developer navigates to tools/scaffold/
- **THEN** CLI source code and configuration are present

### Requirement: Interactive prompts
The CLI SHALL use @clack/prompts for beautiful interactive prompts.

#### Scenario: Prompt display
- **WHEN** CLI runs
- **THEN** prompts are displayed with clear formatting and options

### Requirement: Project type selection
The CLI SHALL prompt user to select project type: Frontend only, Backend only, or Full stack.

#### Scenario: Type selection
- **WHEN** user runs scaffold CLI
- **THEN** project type selection is presented

### Requirement: Feature selection
The CLI SHALL prompt user to select optional features to include.

#### Scenario: Feature options
- **WHEN** user selects project type
- **THEN** relevant feature options are shown (auth, redis, etc.)

### Requirement: App removal for frontend-only
Selecting Frontend only SHALL remove apps/api/ and backend-related packages.

#### Scenario: Remove backend
- **WHEN** user selects Frontend only
- **THEN** apps/api/, packages/database/ are removed

### Requirement: App removal for backend-only
Selecting Backend only SHALL remove apps/web/ and frontend-related packages.

#### Scenario: Remove frontend
- **WHEN** user selects Backend only
- **THEN** apps/web/, packages/ui/, packages/api-client/ are removed

### Requirement: Turbo.json update
After removal, turbo.json SHALL be updated to remove references to deleted apps/packages.

#### Scenario: Config update
- **WHEN** apps are removed
- **THEN** turbo.json pipeline is updated accordingly

### Requirement: Package.json cleanup
After removal, package references SHALL be cleaned from all remaining package.json files.

#### Scenario: Dependency cleanup
- **WHEN** packages are removed
- **THEN** workspace references are removed from dependent packages

### Requirement: Dependency pruning
After cleanup, unused dependencies SHALL be identified for removal.

#### Scenario: Prune suggestion
- **WHEN** cleanup completes
- **THEN** CLI suggests running pnpm install to prune unused deps

### Requirement: Scaffold configuration file
The CLI SHALL read scaffold.config.json for understanding package relationships.

#### Scenario: Config reading
- **WHEN** CLI starts
- **THEN** scaffold.config.json is loaded to determine what belongs to what

### Requirement: Feature removal
Optional features (auth, redis) SHALL be removable via CLI options.

#### Scenario: Remove auth
- **WHEN** user deselects Authentication feature
- **THEN** apps/api/src/modules/auth/ is removed and related imports cleaned

#### Scenario: Remove redis
- **WHEN** user deselects Redis feature
- **THEN** apps/api/src/modules/cache/ is removed and related imports cleaned

### Requirement: Dry run mode
The CLI SHALL support --dry-run flag to preview changes without executing.

#### Scenario: Dry run
- **WHEN** CLI runs with --dry-run
- **THEN** changes are listed but not applied
