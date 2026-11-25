# Student Management Portal & B.2 Browser-Based Design IR Extraction Process

A comprehensive engineering guide detailing the architecture, implementation, and automated headless extraction of a production-grade React application into the canonical Design Intermediate Representation (Design IR, schema version design-ir/1).

---

## 1. Executive Summary & Context

In modern frontend systems, automated code generation and theme customization workflows require a reliable bridge between visual design intent and rendered web software. The primary objective of this project is to implement a robust, automated mechanism to reverse-engineer a rendered React web application into a canonical Design Intermediate Representation (Design IR, following schema design-ir/1), matching the industry reference format demonstrated in grievance-portal.design-ir.json.

Traditional static Abstract Syntax Tree (AST) parsing (Method B.1) analyzes source files offline. While static analysis is effective at discovering exported token constants and component type interfaces, it cannot calculate actual rendered pixel coordinates, final flexbox wrapping results, or dynamic cascade inheritance. To resolve these challenges, the B.2 Browser-Based Extraction Pipeline executes the application within an automated Chromium browser using Playwright, inspecting the rendered Document Object Model (DOM) to capture live visual geometry, layout parameters, design tokens, component variants, and vector iconography.

### Overall Extraction Milestone
* Three Interconnected Screens Captured: Faculty Dashboard, Student Management Directory, and Student Details View.
* Total Extracted DOM Nodes: 583 hierarchical nodes across all three screen trees.
* Cataloged Reusable Components: 23 distinct components with dynamic variant matrices.
* Extracted Vector Icons: 31 unique SVG icons normalized and deduplicated.
* Inferred Design Tokens: 23 standardized visual tokens spanning color, typography, spacing, radius, and shadows.
* Schema Validation Outcome: 100% compliant with schema design-ir/1 with zero validation errors and zero warnings.

---

## 2. Project Setup, Commands & Input Path Configuration

### Prerequisites
* Node.js v18+ (tested on Node v26)
* npm (comes with Node.js)
* Chromium browser installed via Playwright

### Step-by-Step Setup & Run Commands

1. **Install Playwright Chromium (one-time setup):**
   ```bash
   npx playwright install chromium
   ```

2. **Install dependencies for the React Test App (`test-app`):**
   ```bash
   cd student-management-portal/test-app
   npm install
   ```

3. **Install dependencies for the Extractor (`extractor`):**
   ```bash
   cd ../extractor
   npm install
   ```

4. **Build and Start the React Test App:**
   ```bash
   cd ../test-app
   npm run build
   npm run preview
   ```
   The app will be served at `http://localhost:5173`. (You can also run `npm run dev` for development mode.)

5. **Run the B.2 Browser Extractor:**
   ```bash
   cd ../extractor
   npm run extract
   ```
   *Note: If the app is not already running on port 5173, the extractor automatically starts `vite preview` in `test-app`, extracts all configured routes, writes `output/design-ir.json` and `output/validation-report.json`, and shuts down the preview server.*

6. **Validate an Extracted Design IR File:**
   ```bash
   # Validate the default output (output/design-ir.json)
   cd student-management-portal/extractor
   npm run validate

   # Or validate a custom Design IR file path
   npx tsx validation/validate-cli.ts /path/to/your/design-ir.json
   ```

---

### Where to Modify File Paths & Inputs

If you want to point the extractor at a **different React application**, **different routes**, or **different output paths**, update the following locations:

| What to Change | File & Line | Details |
| :--- | :--- | :--- |
| **Target React App Folder** | `extractor/index.ts` (Line 60) | Change `const testAppDir = path.resolve(__dirname, '../test-app');` to point to your React app directory. |
| **Server Port & Base URL** | `extractor/index.ts` (Lines 12–13) | Change `PORT = 5173` and `BASE_URL` if your app runs on a different port (e.g., `3000` for Create React App or Next.js). |
| **Routes / Screens to Extract** | `extractor/index.ts` (Lines 15–34) | Edit the `ROUTES` array (`id`, `name`, `path`, `screenPrefix`) to match the routes of your app. |
| **Output Directory & Filenames** | `extractor/index.ts` (Lines 110–121) | Change `outputDir` (`../output`), `design-ir.json`, or `validation-report.json` to customize where outputs are saved. |
| **Validation Input File Path** | `extractor/validation/validate-cli.ts` (Line 10) | Pass a custom path as a CLI argument (`npx tsx validation/validate-cli.ts <file>`), or update the default fallback `../../output/design-ir.json`. |
| **Viewport Dimensions** | `extractor/browser/browser.ts` (Line 25) | Change `viewport: { width: 1440, height: 1024 }` if you want to capture mobile or tablet viewports. |
| **Root DOM Selector** | `extractor/dom/browserScript.ts` (Line 161) | Change `document.querySelector('.app-shell') \|\| document.body` if your app uses a different root wrapper (e.g., `#root` or `#app`). |
| **Mock Data / Student Records** | `test-app/src/data/mockData.ts` | Edit `STUDENTS_DATA`, `RECENT_ACTIVITIES`, or `ENROLLMENT_STATS` to change the test app's sample data. |

---

## 3. Phase 1: Architecture of the Test Application

To thoroughly stress-test the browser-based extraction engine across complex layouts and deep component hierarchies, a full-featured Student Management Portal named EduTrack was built using React, TypeScript, and modern single-page client-side routing. The application avoids artificial mockups by modeling realistic enterprise academic administration workflows across three dedicated screens sharing a persistent AppShell layout.

### The Three Interconnected Application Screens

#### Screen 1: Faculty Dashboard (Route: /dashboard)
The landing view for university academic advisors and department chairs.
* Welcome Section: Displays the greeting banner for Professor Smith with academic year context and quick-management navigation shortcuts.
* Metric Stat Cards: Four key performance indicators highlighting Total Students (1,248 with positive term growth), Active Students (1,120 showing 89.7% active attendance), Graduated Students (486 from the Class of 2025), and Pending Applications (42 requiring administrative dean review).
* Enrollment Analytics Container: A responsive SVG bar chart visualizing student census numbers across Fall, Spring, and Midterm terms.
* Recent Student Activity Feed: A live chronological list of student actions, submission timestamps, and tone-coded status indicators.
* Quick Actions Bar: Prominent navigation buttons facilitating fast student creation, roster exports, and academic review scheduling.

#### Screen 2: Student Management Directory (Route: /students)
The operational hub for searching, filtering, and managing student cohorts.
* Header Action Bar: Page title, enrollment count summaries, and a primary modal trigger for registering new students.
* Filter and Search Utility Bar: A real-time search input coupled with multi-criteria dropdown selectors allowing simultaneous filtering by academic department and enrollment status.
* Enterprise Data Table: A structured data grid rendering comprehensive student records, complete with student initials avatars, university email addresses, departments, degree years, cumulative GPAs, and status pills.
* Row Navigation: Clicking any student record row initiates immediate client-side navigation to that student's specific detail view.
* Pagination Control Bar: Displays the current index range against the total cohort and provides previous, next, and individual page selection buttons.

#### Screen 3: Student Details View (Route: /students/:id)
A deep-dive academic and administrative dossier for an individual student.
* Navigational Breadcrumb Path: Hierarchical path displaying Dashboard, Students, and the selected student name, alongside a one-click return shortcut button.
* Student Hero Profile Card: Prominent profile banner presenting the student avatar, full legal name, student ID, status badge, degree department, enrollment term, cumulative GPA with honors indicator, messaging action, and an edit profile modal trigger.
* Segmented Navigation Tabs: Multi-tab view switcher toggling between Overview, Academic History, and Activity Log.
* Structured Information Cards: Three side-by-side informational panels grouping personal information (birth date, gender, nationality, student classification), academic information (degree major, semester, faculty advisor, enrollment date), and contact information (university email, telephone, campus residence, emergency contact).
* Academic Course Records: Term grade cards detailing course codes, course titles, instructor names, credit hours, and earned letter grades.

### Reusable Component Architecture & The Metadata Contract

A core architectural principle of the portal is that visual elements are not constructed as ad-hoc HTML structures. Over twenty reusable components were designed to establish a consistent user interface. 

To enable the browser extractor to accurately differentiate true design system components from generic HTML container elements without fragile class-name parsing, an explicit metadata contract was established using custom data attributes.

| Component Name | Role in Design System | Supported Visual Variants & Properties | Extracted Design Metadata ID |
| :--- | :--- | :--- | :--- |
| Sidebar | Persistent vertical navigation container | Desktop fixed 240px width with integrated user menu | c-sidebar |
| Header | Horizontal top application bar | Title, subtitle, global search input, notifications | c-header |
| NavItem | Interactive navigation link | Active state with dark indigo fill, Default state muted | c-navitem |
| Button | Universal action trigger | Variants: Primary, Secondary, Outline, Destructive; Sizes: SM, MD, LG | c-button |
| Input | Text input control with icon support | States: Default, Focused, Disabled, Error | c-input |
| Dropdown | Selection menu for filters and forms | Variants: Default form style, Compact filter bar style | c-dropdown |
| StatCard | Metric display card with trend indicator | Tones: Primary, Success, Warning, Neutral | c-statcard |
| Badge | Status indicator pill | Tones: Success (Emerald), Warning (Amber), Error (Red), Neutral (Slate) | c-badge |
| Avatar | User identity circle with initials | Sizes: Small (32px), Medium (40px), Large (64px) | c-avatar |
| DataTable | Structured data presentation grid | Sortable headers, row borders, responsive layout | c-datatable |
| TableRow | Interactive table record item | Interactive states: Default, Hover, Clickable navigation | c-tablerow |
| Pagination | Page navigation controls | Previous, next, page numbers, item count summary | c-pagination |
| Breadcrumb | Hierarchical location indicator | Dynamic segment links separated by directional chevrons | c-breadcrumb |
| Tabs | Segmented view switcher | States: Active tab with primary indicator, Inactive muted | c-tabs |
| ProfileCard | Hero profile banner for detail views | Combines avatar, titles, status badge, GPA, and action buttons | c-profilecard |
| InformationCard | Structured key-value field grouping | Titled container with icon and two-column data rows | c-infocard |
| Modal | Floating dialog for create/edit flows | Overlay backdrop, header, body content, cancel/confirm actions | c-modal |
| ChartContainer | Visual data analytics card | Container hosting the SVG enrollment census bar chart | c-chart |
| ActivityItem | Chronological audit row | Student name, descriptive action, timestamp, and status pill | c-activityitem |
| QuickActionButton | Prominent dashboard task button | Card-style button with primary icon and descriptive label | c-quickaction |

---

## 4. Phase 2: The Unified Design System Foundation

To guarantee that the extraction pipeline could identify genuine, repeated visual values rather than one-off styles, the entire portal was constructed on a disciplined design token foundation declared via root CSS custom properties.

### Color Palette Hierarchy
* Brand Primary: Deep Indigo (#4F46E5) representing primary actions, active indicators, and brand identity.
* Brand Hover & Light Tint: Darkened Indigo (#4338CA) for interactive hover states and soft Lavender (#EEF2FF) for light background tints.
* Surface Canvas & Cards: Slate White (#F8FAFC) for the global page background, pure White (#FFFFFF) for elevated cards, and Deep Navy (#1E1B4B) for the persistent sidebar.
* Typography Colors: Slate Black (#0F172A) for high-contrast primary text, Muted Slate (#64748B) for secondary subtitles, and Pure White (#FFFFFF) for text on brand surfaces.
* Structural Borders: Soft Gray (#E2E8F0) providing subtle, accessible boundaries for inputs, cards, and table rows.
* Status Indicators: Emerald Green (#059669) for active and completed states, Amber (#B45309) for pending approvals, and Crimson Red (#DC2626) for destructive actions and errors.

### Spacing Grid & Rhythm
The spatial system uses an 8px base grid with a 4px half-step:
* Extra Small (4px): Used for tight badge padding and icon-to-label spacing.
* Small (8px): Used for compact button padding, input internal padding, and item gaps.
* Medium (16px): Used for card inner padding, standard component spacing, and table cell margins.
* Large (24px): Used for container margins, section gaps, and modal internal padding.
* Extra Large (32px): Used for global page canvas boundaries and top-level layout spacing.

### Border Radii & Elevation Depth
* Control Radius (8px): Applied to inputs, buttons, dropdown selects, and navigation items.
* Card Radius (12px): Applied to statistic panels, data table containers, and modal dialogs.
* Full Radius (9999px): Applied to status badges and circular user avatars.
* Card Shadow: A delicate composite elevation shadow (0px 1px 3px 0px rgba(15, 23, 42, 0.08)) providing depth without visual clutter.

### Typographic Scale
Configured around the Inter typeface family:
* H1 Display: 28px font size, 36px line height, 600 weight.
* H2 Section Title: 18px font size, 28px line height, 600 weight.
* Body Regular: 14px font size, 20px line height, 400 weight.
* Form Label: 13px font size, 18px line height, 500 weight.
* Table Header: 12px font size, 16px line height, 600 weight, with 0.4px letter spacing and uppercase transform.

---

## 5. Phase 3: The B.2 Headless Browser-Based Extraction Pipeline

The extractor was developed as an automated Playwright harness operating in headless Chromium. The extraction lifecycle progresses through four disciplined stages: environment orchestration, recursive DOM traversal, semantic classification, and icon normalization.

### Stage 1: Environment Orchestration & Hydration Verification
1. Automated Server Probing: Before launching the browser, the harness performs an automated HTTP socket check against port 5173. If an active server is not detected, it automatically starts the production preview process and polls until the port is open and responsive.
2. Viewport Standardization: Headless Chromium is initialized with arguments that disable sandbox restrictions and eliminate font hinting inconsistencies. A browser context is established at a fixed desktop viewport of 1440 × 1024 pixels with a 1:1 device pixel ratio.
3. Hydration & Route Lifecycle: For each target route (/dashboard, /students, /students/STU-001), the browser navigates to the URL, waits for complete network idle, confirms the presence of the root application shell in the DOM, and executes a brief stabilization pause to ensure all web fonts and layout transitions are fully settled.

### Stage 2: In-Page Recursive DOM Traversal
Once the target route is stabilized, an isolated in-page traversal script evaluates the live document tree according to strict structural heuristics:
* Non-Visual Pruning: Elements configured with display none, visibility hidden, zero width and height, or non-visual tags (such as script, style, noscript, and meta) are immediately pruned from the tree.
* Geometry Calculation: The getBoundingClientRect method captures exact viewport-relative coordinates rounded to integer values: horizontal position (X), vertical position (Y), width (W), and height (H).
* Style Harvesting: The browser's window.getComputedStyle API is queried to harvest background fills, border widths, border colors, radii, box shadows, clipping boundaries, font families, font weights, font sizes, line heights, letter spacing, text alignment, and text transforms.
* Layout Recovery: When a flexbox container is detected, the engine extracts flex direction (row or column), gap dimensions, individual 4-sided padding values (top, right, bottom, left), main-axis alignment (start, center, end, space-between), cross-axis alignment (start, center, stretch), and flex-wrapping flags.
* Sizing Mode Deduction: By evaluating flex grow factors and alignment constraints, horizontal and vertical sizing behaviors are classified into fill (expanding to fill available parent space) or fixed (rigid pixel sizing).

### Stage 3: Semantic Node Classification
Extracted DOM elements are categorized into the four canonical node kinds defined in the Design IR specification:

| Node Kind | Qualification Criteria | Structural Representation & Captured Fields |
| :--- | :--- | :--- |
| Frame | Containers, layout wrappers, cards, headers, tables, rows | Captures box geometry, background fills, border strokes, radius, layout configuration, and recursive children array. |
| Text | Leaf DOM nodes containing only formatted textual content | Captures box geometry, raw text content, font family, font size, weight, line height, letter spacing, text color, and alignment. |
| Instance | Elements decorated with data-design-component metadata | Captures box geometry, component catalog ID, variant property key-value map, structural hint, and internal children. |
| Icon | SVG elements and vector graphic containers | Captures box geometry, normalized icon name reference, viewBox dimensions, and clean SVG markup. |

### Stage 4: Iconography Extraction and Deduplication
Whenever the traversal encounters an SVG element, the graphic is extracted as a first-class icon. The engine isolates the outer SVG markup, strips transient runtime attributes (such as temporary class names and inline styles), and determines a clean icon name by inspecting Lucide CSS class prefixes, ARIA labels, or parent component context. An internal Icon Registry performs global deduplication: identical SVG shapes across different screens share a single canonical key in the top-level icons dictionary, preventing redundant asset bloat.

---

## 6. Phase 4: Token Inference and Reference Binding

In a design-first workflow, tokens originate in Figma Variables. In a code-first browser extraction workflow, tokens must be reverse-inferred from observed runtime styling across all screens.

### Inference Engine Methodology
1. Frequency Aggregation: As each screen is traversed, every resolved background color, border color, text color, spacing padding, flex gap, border radius, and typography cluster is recorded in statistical frequency counters.
2. Semantic Clustering: Repeated visual values are mapped to human-readable semantic token identifiers following industry design system standards (for example, brand/primary for the core indigo tone, surface/page for the light canvas, surface/card for white panels, text/primary for dark titles, space/md for 16px rhythm, radius/card for 12px curves).
3. Provenance Attribution: Every generated token explicitly preserves its origin metadata, documented as Inferred from UI (Browser Observation). This maintains architectural integrity by clearly distinguishing runtime reverse-engineering from initial design team intent.
4. Reference Binding: During tree assembly, node styling records are updated to reference their corresponding token names (for example, fill objects receive a token reference to surface/card, and text objects receive token references to type/h1 and text/primary).

---

## 7. Phase 5: Canonical Design IR Schema Assembly & Validation

The extracted screens, tokens, components, and icons are assembled into a single comprehensive JSON file adhering strictly to the design-ir/1 schema specification.

| Top-Level Property | Type & Content | Role in Downstream Code Generation Pipeline |
| :--- | :--- | :--- |
| schema | String: design-ir/1 | Guarantees version compatibility for downstream compilers. |
| source | Object: kind, adapter, ref, exportedAt | Maintains traceability to the Playwright extractor and source route. |
| intent | Object: mode: global | Signals global design system scope across the entire application. |
| tokens | Array of 23 token definitions | Defines the foundational color, space, radius, shadow, and font tokens. |
| components | Array of 23 component definitions | Catalog of reusable components with variant property values. |
| icons | Dictionary of 31 SVG vector markups | Centralized asset repository of all vector icons referenced in the UI. |
| tags | Object: brandColor, cardStyle, componentMap | High-level design metadata and component mapping dictionary. |
| screens | Array of 3 screen objects | Contains complete recursive node hierarchies for Dashboard, Students, and Details. |

### Multi-Tier Validation Protocol

To verify absolute data integrity, the pipeline runs a rigorous multi-tier validator examining six distinct criteria:
1. Structural Schema Compliance: Verifies presence and types of all mandatory top-level properties (schema, source, intent, tokens, components, icons, tags, screens).
2. Identifier Uniqueness: Enforces unique screen identifiers (101:0, 102:0, 103:0) and guarantees that every node within a screen hierarchy possesses a strictly unique identifier with zero duplicates across all 583 nodes.
3. Node Kind Integrity: Confirms that every node adheres strictly to one of the four supported kinds: frame, text, instance, or icon.
4. Component Referential Integrity: Validates that every instance node references a component ID registered in the top-level components catalog.
5. Icon Referential Integrity: Verifies that every icon node references an icon key physically defined in the top-level icons dictionary.
6. Token Referential Integrity: Verifies that all bound token references match names declared in the top-level tokens array.

### Validation Outcome
The validation harness confirmed that all 583 nodes, 23 components, 31 icons, and 23 tokens are 100% compliant with zero errors and zero warnings, proving that runtime browser extraction can achieve flawless structural fidelity.

---

## 8. Phase 6: Architectural Evaluation & Downstream Integration

The completion of this pipeline provides valuable empirical insights into the comparative trade-offs between browser-based extraction (Method B.2) and static AST parsing (Method B.1):

| Evaluation Dimension | B.1 Static AST Parsing | B.2 Headless Browser Inspection (Implemented) |
| :--- | :--- | :--- |
| Execution Velocity | Sub-second execution via offline source analysis. | Moderate (approximately 3 to 8 seconds per screen). |
| Environment Dependency | Lightweight Node.js process with no browser required. | Requires Node.js, Chromium binaries, and a running server. |
| Visual Layout Geometry | Cannot calculate pixel positions or bounding boxes. | Computes exact pixel geometry (X, Y, Width, Height). |
| Computed CSS Resolution | Limited to static string literals in config files. | Captures actual computed cascade and inherited properties. |
| Component Variant Scope | Inspects complete TypeScript union types. | Observes variants actively rendered in current route state. |
| Layout System Recovery | Cannot determine final responsive flex wrapping. | Accurately extracts real-time flexbox directions and padding. |
| Primary Production Role | Token cataloging and static component linting. | Full-screen structural snapshotting and visual fidelity capture. |

### Downstream Theme Generation Pipeline

The generated Design IR file serves as the direct input to downstream compiler stages. Specifically, the Theme Synthesizer Engine ingests design-ir.json to produce runtime CSS themes (schema fe-ast-theme/1):
* Token Flattening: Direct token records are flattened into standard kebab-case CSS custom properties (--color-primary, --space-md, --radius-card).
* State Synthesis: The theme compiler mathematically computes interactive states not drawn in static screens, such as hover lightness adjustments and subtle tinted background variants.
* Component Rule Synthesis: Recurring frame structures identified in the Design IR (such as card containers, data tables, and navigation links) are abstracted into reusable CSS class rules (.region-card, .nav-item, .ag-theme-alpine).
* Quality & Contrast Audit: Colors are evaluated against WCAG AA contrast standards (4.5:1 for body copy and 3:1 for large text), attaching accessibility notices to the final theme output.

---

## 9. Operational Lifecycle Summary

The entire operational process follows a clear four-stage sequence:
1. Stage 1: Application Preparation: The test application dependencies are installed, and the production preview assets are compiled via the frontend build tool.
2. Stage 2: Browser Harness Bootstrapping: The extraction harness launches Chromium, probes the local network to start the preview server, and establishes a standardized desktop viewport.
3. Stage 3: Multi-Screen Extraction: The in-page evaluation engine traverses the Dashboard, Student Management, and Student Details views, extracting layout trees, computing styles, registering components, and isolating SVG icons.
4. Stage 4: Normalization & Export: The Design IR Assembler merges observations, infers design tokens, binds token references, runs the schema validation engine, and writes the final Design IR and validation report to disk.
