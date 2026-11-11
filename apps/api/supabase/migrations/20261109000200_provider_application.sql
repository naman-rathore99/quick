begin;

drop function if exists public.save_provider_application(uuid, text, text, jsonb);

create or replace function public.save_provider_application(
  account_id uuid, area text, profile_bio text, offers jsonb, contact_phone text
)
returns void
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  offer record;
begin
  insert into public.users (id, name, role, location, phone)
  select id, coalesce(nullif(raw_user_meta_data->>'full_name', ''), split_part(email, '@', 1), 'Provider'),
         'PROVIDER', area, contact_phone
    from auth.users
   where id = account_id
  on conflict (id) do update set role = excluded.role, location = excluded.location, phone = excluded.phone;
  if not found then
    raise no_data_found;
  end if;

  for offer in select * from jsonb_to_recordset(offers) as item(service_id uuid, custom_price numeric)
  loop
    update public.provider_services
       set custom_price = offer.custom_price, bio = profile_bio
     where provider_id = account_id and service_id = offer.service_id and bundle_name is null;
    if not found then
      insert into public.provider_services (provider_id, service_id, custom_price, bio)
      values (account_id, offer.service_id, offer.custom_price, profile_bio);
    end if;
  end loop;
end;
$$;

revoke all on function public.save_provider_application(uuid, text, text, jsonb, text) from public, anon, authenticated;
grant execute on function public.save_provider_application(uuid, text, text, jsonb, text) to service_role;

commit;
