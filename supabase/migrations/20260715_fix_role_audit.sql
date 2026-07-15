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
