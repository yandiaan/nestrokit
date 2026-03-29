## ADDED Requirements

### Requirement: Astro application structure
The frontend app SHALL be located at apps/web/ with Astro as the primary framework.

#### Scenario: App location
- **WHEN** developer navigates to apps/web/
- **THEN** Astro application files are present with standard structure

### Requirement: File-based routing
The frontend SHALL use Astro's file-based routing with pages in src/pages/ directory.

#### Scenario: Page routing
- **WHEN** developer creates src/pages/about.astro
- **THEN** page is accessible at /about route

#### Scenario: Dynamic routing
- **WHEN** developer creates src/pages/posts/[slug].astro
- **THEN** dynamic route captures slug parameter

### Requirement: Svelte islands for interactivity
Interactive components SHALL be implemented as Svelte components with Astro's client:* directives.

#### Scenario: Client-side hydration
- **WHEN** component uses client:load directive
- **THEN** Svelte component hydrates on page load

#### Scenario: Lazy hydration
- **WHEN** component uses client:visible directive
- **THEN** Svelte component hydrates when visible in viewport

### Requirement: Svelte stores for state management
Client-side state SHALL be managed using Svelte's built-in stores with stores defined in src/stores/.

#### Scenario: Store creation
- **WHEN** developer creates a store in src/stores/
- **THEN** store is importable by any Svelte component

#### Scenario: Cross-component state
- **WHEN** multiple Svelte islands share a store
- **THEN** state updates synchronize across all subscribed components

### Requirement: Tailwind CSS styling
The frontend SHALL use Tailwind CSS for styling with configuration extending @repo/config/tailwind.

#### Scenario: Tailwind classes
- **WHEN** developer uses Tailwind utility classes
- **THEN** styles are applied correctly in development and production

#### Scenario: Custom configuration
- **WHEN** developer modifies tailwind.config.mjs
- **THEN** custom theme extensions are available

### Requirement: Hybrid rendering mode
Astro SHALL be configured in hybrid mode allowing per-route SSR opt-in.

#### Scenario: Static page
- **WHEN** page has no prerender export or export const prerender = true
- **THEN** page is statically generated at build time

#### Scenario: Server-rendered page
- **WHEN** page exports const prerender = false
- **THEN** page is server-rendered on each request

### Requirement: API client integration
The frontend SHALL use @repo/api-client for typed API communication with the backend.

#### Scenario: API call from island
- **WHEN** Svelte island calls an API endpoint
- **THEN** call uses generated typed client with full autocomplete

#### Scenario: Error handling
- **WHEN** API call fails
- **THEN** error is typed and handleable in component
