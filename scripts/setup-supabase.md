# Supabase quick-start for CarControl

## 1. Create new project

1. Open https://supabase.com
2. Create a new project
3. Copy:
   - Project URL
   - anon/public key
   - service role key (for backend/admin tasks only)

## 2. Configure environment

Create `.env` in the project root:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## 3. Install CLI

```powershell
npm install -g supabase
```

## 4. Login

```powershell
supabase login
```

## 5. Link project

```powershell
supabase link --project-ref <your-project-ref>
```

## 6. Apply migrations

```powershell
supabase db push
```

## 7. Start local Supabase container

```powershell
npm run supabase:start
```

## 8. Check status

```powershell
npm run supabase:status
```

## 9. Enable Auth email sign-in

Go to Supabase dashboard:
- Authentication
- Providers
- Email
- enable email sign up / sign in

## 10. Create login form logic

Use these functions for the frontend:

```ts
import { signInWithEmail, signUpWithEmail, validateEmail } from './src/lib/supabase';
```

Example:

```ts
if (!validateEmail(email)) {
  throw new Error('Некорректный email');
}

const { data, error } = await signUpWithEmail(email, password, 'Имя пользователя');
```

## 11. Database table for profiles

The migration in `supabase/migrations/20260918_create_profiles.sql` creates:
- `public.profiles`
- Row Level Security
- trigger to create profile on auth.users insert

## 12. Future improvements

You can later add:
- `cars` table
- `service_records` table
- `notifications`
- `documents` / attachments
- `subscriptions`

## 13. Security

Never expose the service role key to the browser. Use anon key only in the frontend.
