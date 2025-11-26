-- Create table for additional gallery images
create table if not exists public.gallery_images (
    id uuid default gen_random_uuid() primary key,
    gallery_id uuid references public.gallery(id) on delete cascade not null,
    image_url text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.gallery_images enable row level security;

-- Create policies
create policy "Enable read access for all users"
    on public.gallery_images for select
    using (true);

create policy "Enable insert for admins"
    on public.gallery_images for insert
    with check (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

create policy "Enable delete for admins"
    on public.gallery_images for delete
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );
