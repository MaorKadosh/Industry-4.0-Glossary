# Changelog

All notable changes to this project are documented in this file. The format follows Keep a Changelog, and the project uses Semantic Versioning.

## [1.3.0] - 2026-07-16

### Added

- Dedicated lecture filter alongside text search and sorting controls.
- Twelve distinct visual color treatments for lecture labels.
- Clear registration messaging that Viewer access is immediate while editing requires Admin approval.

### Changed

- Replaced the generic professional-term label with the associated lecture label on every glossary card.
- Updated the application footer with the full course and creator credit.

## [1.2.1] - 2026-07-16

### Changed

- Updated the application header subtitle to identify the 2026 managers and entrepreneurs lecture series.
- Added responsive wrapping and sizing for the longer header subtitle on mobile screens.

## [1.2.0] - 2026-07-15

### Added

- Required lecture categorization for term creation and editing using the twelve course lectures.
- Device-local persistence of the last lecture selected when adding a term.
- Lecture metadata on every glossary card, including a clear fallback for existing uncategorized terms.
- Lecture-aware glossary search.
- Incremental Supabase migration adding the nullable `terms.lecture_id` text column.

### Changed

- Replaced the main glossary tagline with the new information-age, logistics, and procurement course description.

## [1.1.4] - 2026-07-15

### Changed

- Replaced the application logo with the supplied Industry 4.0 artwork throughout the authentication screen, main header, and loading state.
- Added optimized 32 px, 180 px, 192 px, 512 px, and 1024 px logo assets for browser tabs, Apple devices, Android installation, and high-resolution displays.
- Updated the manifest and application metadata to reference cache-safe logo filenames.
- Rotated the service worker cache so existing users receive the new branding assets.

## [1.1.3] - 2026-07-15

### Fixed

- Routed Android installation attempts from Samsung Internet to Google Chrome to avoid the browser-generated WebAPK compatibility warning from Google Play Protect.
- Added browser-specific Hebrew installation guidance and a direct Chrome handoff action.
- Strengthened the Web App Manifest with a stable application ID, full scope, standard-purpose icons, orientation, categories, and explicit related-app behavior.
- Updated service worker registration to use the full application scope and bypass stale script caching.

## [1.1.2] - 2026-07-15

### Fixed

- Removed unnecessary trailing mobile scroll space by using dynamic viewport sizing and tighter content spacing.
- Prevented horizontal decorative overflow from expanding the mobile page area.
- Raised the centered new-term action above the footer credit and mobile safe area.
- Moved transient status messages above the elevated action button.

## [1.1.1] - 2026-07-15

### Added

- Native application sharing with a WhatsApp and SMS-compatible invitation.
- Clipboard fallback for browsers without Web Share API support.

### Changed

- Replaced long dash characters with standard hyphens in displayed text.
- Enlarged and centered the new-term action button at the bottom of the viewport.

## [1.1.0] - 2026-07-15

### Added

- Admin role assignment through the administration dashboard.
- Protection against demoting the currently signed-in Admin through the UI.
- Installable Progressive Web App manifest and desktop or home-screen icons.
- Native installation prompt with fallback instructions for unsupported browsers.
- Persistent user-selectable dark mode on authenticated and authentication screens.
- Application footer credit.
- Incremental Supabase migration for role audit bootstrapping.

### Changed

- Registration success messaging now reflects immediate access without email confirmation.
- Role audit formatting now supports Viewer, Editor, and Admin assignments.
- Supabase role audit trigger now handles SQL Editor bootstrapping safely.

## [1.0.0] - 2026-07-15

### Added

- Mobile-first Hebrew RTL glossary interface.
- Supabase email and password authentication.
- Viewer, Editor, and Admin permission model.
- Search and alphabetical or chronological term sorting.
- Create, edit, and delete term dialogs.
- Admin user management and role assignment.
- Database-triggered audit log with Admin-only visibility.
- PostgreSQL schema, indexes, grants, triggers, and Row Level Security policies.
- Responsive glassmorphism design, micro-interactions, and reduced-motion support.
- Syllabus-based demo vocabulary and offline demo mode.
- Setup, security, and deployment documentation.
