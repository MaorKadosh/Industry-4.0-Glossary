# Industry 4.0 Glossary

A mobile-first Hebrew glossary application for the Master's course "The Information Age and Industry 4.0 in Logistics and Supply Chain Management – Managers' Views" (course 55-724).

The application provides a searchable academic glossary, role-based editing, user administration, and an immutable audit trail. The initial demo vocabulary is based on the supplied course syllabus.

## Features

- Fully responsive RTL interface optimized for Android and iOS browsers
- Email and password authentication through Supabase Auth
- Viewer, Editor, and Admin roles enforced with PostgreSQL Row Level Security
- Search and alphabetical or chronological sorting
- Create, edit, and delete workflows for Editors and Admins
- Admin-only user role management
- Admin-only audit log with database-triggered events
- Admin promotion and demotion through the protected administration interface
- Installable Progressive Web App for desktop, Android, and iOS home screens
- User-selectable dark mode persisted on the current device
- Local demo mode when Supabase environment variables are not configured
- Accessible dialogs, keyboard focus states, reduced-motion support, and touch-friendly controls

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Supabase Auth and PostgreSQL
- Lucide React icons
- Web App Manifest and install prompt support

## Local setup

1. Install Node.js 22.13 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local`.
4. Create a Supabase project and copy the project URL and anonymous key into `.env.local`.
5. Open the Supabase SQL Editor and run `supabase/schema.sql` once.
6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open `http://localhost:3000`.

If the environment variables are omitted, the application starts in demo mode with realistic course data. Demo changes remain in memory until the page is refreshed.

## Bootstrapping the first Admin

Register the first trusted administrator through the application, copy the account UUID from `Authentication > Users`, and run the following statement once in the Supabase SQL Editor:

```sql
update public.users
set role = 'admin'
where id = 'ADMIN_USER_UUID'::uuid;
```

After the first Admin signs in, additional administrators can be assigned from the administration dashboard without SQL. The application never grants Admin access based on a display name because names are not unique and can be selected by another user.

## Role model

| Role | View terms | Add terms | Edit terms | Delete terms | Manage users | View audit log |
| --- | --- | --- | --- | --- | --- | --- |
| Viewer | Yes | No | No | No | No | No |
| Editor | Yes | Yes | Yes | Yes | No | No |
| Admin | Yes | Yes | Yes | Yes | Yes | Yes |

New accounts receive the Viewer role. An Admin can assign Viewer, Editor, or Admin access from the administration dashboard. The currently signed-in Admin cannot demote their own account in the UI, ensuring that at least one accessible administrator remains.

## Existing database migration

Projects created before version 1.1.0 must run the following migration once in the Supabase SQL Editor:

```text
supabase/migrations/20260715_fix_role_audit.sql
```

The migration preserves the authenticated Admin as the audit actor and provides a safe fallback for initial role bootstrapping from the SQL Editor.

## Email confirmation

The application is designed to support immediate sign-in after registration. In the Supabase Dashboard, open `Authentication > Providers > Email`, disable `Confirm email`, and save the provider settings. New users will then receive the Viewer role and an active session without an email confirmation step.

## App installation and theme

Supported browsers display an install icon in the application header. It opens the native installation prompt when available and otherwise shows platform-specific instructions for adding the application to the desktop or home screen. Dark mode can be selected from the adjacent moon or sun icon and is stored locally on the device.

## Database security

The database schema uses Row Level Security for every public table. UI visibility is not treated as authorization. PostgreSQL policies independently enforce the following rules:

- Authenticated users can read terms and basic profiles.
- Only Editors and Admins can mutate terms.
- Only Admins can update roles or read audit logs.
- Admins can promote other users to Admin, while the UI prevents self-demotion.
- Audit rows are inserted only by security-definer triggers and cannot be changed by authenticated clients.

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
```

## Project structure

```text
app/                 Next.js routes, metadata, manifest, and global styles
components/          Authentication, installation, glossary, dialogs, and administration UI
lib/                 Supabase client and demo data
supabase/schema.sql  Tables, indexes, triggers, grants, and RLS policies
supabase/migrations/ Incremental SQL updates for existing databases
types/               Shared database and application types
```

## Production checklist

- Configure the production Supabase URL and anonymous key.
- Disable email confirmation if immediate registration is required.
- Bootstrap the first Admin account using the secure UUID-based procedure above.
- Run pending files under `supabase/migrations/` in existing Supabase projects.
- Review password requirements and SMTP delivery settings.
- Validate RLS policies in a staging project using one account for each role.
- Run `npm run build` before deployment.

## License

This project is intended for course use. Add the institution's preferred license before public distribution.
