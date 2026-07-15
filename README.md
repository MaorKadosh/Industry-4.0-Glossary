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
- Local demo mode when Supabase environment variables are not configured
- Accessible dialogs, keyboard focus states, reduced-motion support, and touch-friendly controls

## Technology

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Supabase Auth and PostgreSQL
- Lucide React icons
- Vinext and Vite for Cloudflare-compatible builds

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

## Creating the Admin account

Register Matan Suissa through the application first. Then run the following statements in the Supabase SQL Editor, replacing the email value with Matan's verified email address:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'MATAN_EMAIL';

update public.users
set name = 'Matan Suissa', role = 'admin'
where id = (select id from auth.users where email = 'MATAN_EMAIL');
```

The application does not grant Admin access based on a display name. This prevents another user from obtaining elevated permissions by registering with the same name.

## Role model

| Role | View terms | Add terms | Edit terms | Delete terms | Manage users | View audit log |
| --- | --- | --- | --- | --- | --- | --- |
| Viewer | Yes | No | No | No | No | No |
| Editor | Yes | Yes | Yes | Yes | No | No |
| Admin | Yes | Yes | Yes | Yes | Yes | Yes |

New accounts receive the Viewer role. An Admin can promote them to Editor or return them to Viewer from the administration dashboard.

## Database security

The database schema uses Row Level Security for every public table. UI visibility is not treated as authorization. PostgreSQL policies independently enforce the following rules:

- Authenticated users can read terms and basic profiles.
- Only Editors and Admins can mutate terms.
- Only Admins can update roles or read audit logs.
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
app/                 Next.js routes, metadata, and global styles
components/          Authentication, glossary, dialogs, and administration UI
lib/                 Supabase client and demo data
supabase/schema.sql  Tables, indexes, triggers, grants, and RLS policies
types/               Shared database and application types
```

## Production checklist

- Configure the production Supabase URL and anonymous key.
- Enable email confirmation and configure approved redirect URLs in Supabase Auth.
- Create the Matan Suissa Admin account using the secure procedure above.
- Review password requirements and SMTP delivery settings.
- Validate RLS policies in a staging project using one account for each role.
- Run `npm run build` before deployment.

## License

This project is intended for course use. Add the institution's preferred license before public distribution.
