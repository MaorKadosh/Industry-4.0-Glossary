# Changelog

All notable changes to this project are documented in this file. The format follows Keep a Changelog, and the project uses Semantic Versioning.

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
