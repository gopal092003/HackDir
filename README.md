# Hackathon Directory

A fast, lightweight hackathon directory built with Next.js 15, TypeScript, Tailwind CSS v4, and Supabase.

## Stack

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Security**: Row Level Security (RLS)
- **Hosting**: Vercel

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home — active & upcoming hackathons
│   ├── past/page.tsx             # Past — completed hackathons
│   ├── sites/page.tsx            # Sites — useful resources
│   ├── login/page.tsx            # Admin login
│   ├── api/
│   │   ├── hackathons/route.ts   # POST
│   │   ├── hackathons/[id]/route.ts  # PATCH, DELETE
│   │   ├── sites/route.ts        # POST
│   │   └── sites/[id]/route.ts   # PATCH, DELETE
│   ├── layout.tsx
│   ├── loading.tsx
│   └── globals.css
├── components/
│   ├── navbar.tsx
│   ├── logout-button.tsx
│   ├── data-table.tsx            # HackathonTable + SiteTable
│   ├── pagination.tsx
│   └── forms/
│       ├── hackathon-form.tsx
│       └── site-form.tsx
└── lib/
    ├── supabase/
    │   ├── client.ts             # Browser client
    │   ├── server.ts             # Server component client
    │   └── middleware.ts         # Session refresh
    ├── queries.ts                # All DB queries
    ├── auth.ts                   # Admin session check
    ├── validations.ts            # Form validation
    └── types.ts                  # TypeScript types
```

---

## Setup

### 1. Create Supabase Project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the SQL Setup Script

Open the Supabase SQL editor and run `supabase-setup.sql` in its entirety.

This will:
- Create `hackathons` and `sites` tables
- Create indexes for performance
- Create the `hackathons_view` view (auto status: Live / Upcoming / Completed)
- Create the `updated_at` trigger
- Enable RLS with public read + admin write policies

### 3. Create the Admin Account

1. Go to **Authentication → Users → Add user**
2. Enter your email and password
3. Copy the UUID of the newly created user
4. In the SQL editor, re-run:

```sql
create policy "admin manage hackathons"
  on hackathons for all
  using (auth.uid() = 'YOUR_ACTUAL_UUID')
  with check (auth.uid() = 'YOUR_ACTUAL_UUID');

create policy "admin manage sites"
  on sites for all
  using (auth.uid() = 'YOUR_ACTUAL_UUID')
  with check (auth.uid() = 'YOUR_ACTUAL_UUID');
```

### 4. Disable Signups

Go to **Authentication → Settings** and disable **Enable Signups** so no new accounts can be created.

### 5. Local Development

```bash
# Install dependencies
npm install

# Copy the env template
cp .env.local.example .env.local

# Fill in your Supabase URL and anon key
# (found in Supabase: Settings → API)
nano .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

1. Push your repository to GitHub
2. Import it in [vercel.com](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

---

## Features

| Feature | Details |
|---|---|
| Public browsing | Active, upcoming, completed hackathons + sites |
| Sorting | Prize and end date, asc/desc |
| Pagination | 25 records per page, SQL-level |
| Admin CRUD | Add, edit, delete hackathons and sites |
| Auto status | No cron jobs — computed from timestamps via DB view |
| Auto timestamps | `updated_at` via Postgres trigger |
| Auth | Supabase Auth, single admin account |
| Security | RLS policies — public read, admin write |
| Server Components | Fast first render, good SEO |
| SSR Supabase client | Official `@supabase/ssr` pattern |
| Form validation | Client-side before API calls |

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```
