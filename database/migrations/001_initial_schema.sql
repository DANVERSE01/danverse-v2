-- DANVERSE v2 Database Schema
-- Initial migration for leads and audit logging

-- Create leads table
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  phone text,
  company text,
  budget_range text,
  service text,
  message text,
  source text,
  status text default 'new' check (status in ('new','qualified','won','lost')),
  created_at timestamptz default now()
);

-- Create audit_log table
create table if not exists audit_log (
  id bigserial primary key,
  actor text,
  action text,
  target text,
  meta jsonb,
  at timestamptz default now()
);

-- Create indexes for better performance
create index if not exists idx_leads_email on leads(email);
create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created_at on leads(created_at);
create index if not exists idx_leads_service on leads(service);

create index if not exists idx_audit_log_actor on audit_log(actor);
create index if not exists idx_audit_log_action on audit_log(action);
create index if not exists idx_audit_log_at on audit_log(at);

-- Enable Row Level Security (RLS)
alter table leads enable row level security;
alter table audit_log enable row level security;

-- Create policies for leads table
create policy "Enable read access for service role" on leads
  for select using (true);

create policy "Enable insert access for service role" on leads
  for insert with check (true);

create policy "Enable update access for service role" on leads
  for update using (true);

-- Create policies for audit_log table
create policy "Enable read access for service role" on audit_log
  for select using (true);

create policy "Enable insert access for service role" on audit_log
  for insert with check (true);

-- Insert initial audit log entry
insert into audit_log (actor, action, target, meta) values 
('system', 'schema_migration', 'database', '{"migration": "001_initial_schema", "version": "v2.0.0"}');

