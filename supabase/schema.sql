create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'editor', 'viewer');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  role public.user_role not null default 'viewer'
);

create table public.terms (
  id uuid primary key default gen_random_uuid(),
  term text not null unique check (char_length(term) between 2 and 120),
  definition text not null check (char_length(definition) between 20 and 1200),
  lecture_id text,
  created_by uuid not null constraint terms_created_by_fkey references public.users(id),
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  user_id uuid not null constraint audit_logs_user_id_fkey references public.users(id),
  timestamp timestamptz not null default now()
);

create index terms_term_idx on public.terms using btree (term);
create index terms_created_at_idx on public.terms using btree (created_at desc);
create index audit_logs_timestamp_idx on public.audit_logs using btree (timestamp desc);
create index audit_logs_user_id_idx on public.audit_logs using btree (user_id);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.can_edit_terms()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'name'), ''), split_part(new.email, '@', 1)),
    case when new.raw_app_meta_data ->> 'role' = 'admin' then 'admin'::public.user_role else 'viewer'::public.user_role end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.log_term_action()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  subject text;
  action_name text;
begin
  actor_id := coalesce(auth.uid(), case when tg_op = 'INSERT' then new.created_by else old.created_by end);
  subject := case when tg_op = 'DELETE' then old.term else new.term end;
  action_name := case tg_op when 'INSERT' then 'created' when 'UPDATE' then 'updated' else 'deleted' end;
  insert into public.audit_logs (action, user_id) values (action_name || '|' || subject, actor_id);
  return case when tg_op = 'DELETE' then old else new end;
end;
$$;

create trigger terms_audit_trigger
  after insert or update or delete on public.terms
  for each row execute procedure public.log_term_action();

create or replace function public.log_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
begin
  if old.role is distinct from new.role then
    actor_id := coalesce(auth.uid(), new.id);

    insert into public.audit_logs (action, user_id)
    values ('role_updated|' || new.name || '|' || new.role::text, actor_id);
  end if;
  return new;
end;
$$;

create trigger users_role_audit_trigger
  after update of role on public.users
  for each row execute procedure public.log_role_change();

alter table public.users enable row level security;
alter table public.terms enable row level security;
alter table public.audit_logs enable row level security;

create policy "Authenticated users can view profiles"
  on public.users for select
  to authenticated
  using (true);

create policy "Admins can update user roles"
  on public.users for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Authenticated users can view terms"
  on public.terms for select
  to authenticated
  using (true);

create policy "Editors and admins can create terms"
  on public.terms for insert
  to authenticated
  with check (public.can_edit_terms() and created_by = auth.uid());

create policy "Editors and admins can update terms"
  on public.terms for update
  to authenticated
  using (public.can_edit_terms())
  with check (public.can_edit_terms());

create policy "Editors and admins can delete terms"
  on public.terms for delete
  to authenticated
  using (public.can_edit_terms());

create policy "Admins can view audit logs"
  on public.audit_logs for select
  to authenticated
  using (public.is_admin());

revoke insert, update, delete on public.audit_logs from authenticated;
grant select on public.audit_logs to authenticated;
grant select, update on public.users to authenticated;
grant select, insert, update, delete on public.terms to authenticated;
