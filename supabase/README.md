# Supabase setup for CarControl

## 1. Install Supabase CLI

Windows:

```powershell
npm install -g supabase
```

Or via official docs if you prefer the standalone installer.

## 2. Login to Supabase

```bash
supabase login
```

## 3. Initialize in the project

```bash
supabase init
```

This creates:
- `supabase/config.toml`
- `supabase/seed.sql`
- `supabase/migrations/`

## 4. Link to your Supabase project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Get your project ref from the Supabase dashboard → Project settings → General.

## 5. Apply migration

```bash
supabase db push
```

Or if using local dev:

```bash
supabase start
supabase db reset
```

## 6. Environment variables

Add to `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 7. Auth setup

In the Supabase dashboard:
- Authentication → Providers → Email
- enable Email auth
- enable email confirmation if needed
- optionally set redirect URL for local dev

## 8. Realtime / storage / RLS

For the current version, the essentials are:
- Email Auth enabled
- profile table with Row Level Security
- optional storage bucket for avatar or documents later

## 9. Useful commands

```bash
npm run supabase:check
npm run supabase:status
npm run supabase:start
npm run supabase:stop
```

## 10. Current app auth logic

The app is structured to work with Supabase Auth, and the next step is to replace the demo login with:

```ts
await signInWithEmail(email, password)
```

and to keep user data in the `public.profiles` table.
