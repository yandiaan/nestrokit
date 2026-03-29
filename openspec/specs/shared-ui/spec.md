## ADDED Requirements

### Requirement: Package location and exports
The UI package SHALL be located at packages/ui/ with components exported from src/index.ts.

#### Scenario: Package import
- **WHEN** code imports from @repo/ui
- **THEN** all public components and actions are accessible

### Requirement: Svelte component library
The package SHALL provide reusable Svelte components styled with Tailwind CSS.

#### Scenario: Component availability
- **WHEN** developer needs common UI component
- **THEN** component is available from @repo/ui (Button, Input, etc.)

### Requirement: Tailwind CSS styling
All components SHALL use Tailwind CSS classes with support for customization via props.

#### Scenario: Default styling
- **WHEN** component is used without variant props
- **THEN** default Tailwind styles are applied

#### Scenario: Variant styling
- **WHEN** component is used with variant prop
- **THEN** appropriate variant styles are applied

### Requirement: TypeScript props
All components SHALL have fully typed props with TypeScript interfaces.

#### Scenario: Props autocomplete
- **WHEN** developer uses component
- **THEN** IDE provides autocomplete for all valid props

#### Scenario: Type errors
- **WHEN** invalid prop is passed
- **THEN** TypeScript shows error

### Requirement: Reusable Svelte actions
The package SHALL provide common Svelte actions for use in components.

#### Scenario: Action import
- **WHEN** developer needs common action (clickOutside, portal, tooltip, etc.)
- **THEN** action is importable from @repo/ui

### Requirement: Astro island compatibility
All components SHALL be compatible with Astro's island architecture (client:* directives).

#### Scenario: Island usage
- **WHEN** component is used in .astro file with client directive
- **THEN** component hydrates correctly on client
