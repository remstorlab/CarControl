import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const hasEnv = fs.existsSync(envPath);
const env = hasEnv ? fs.readFileSync(envPath, 'utf8') : '';

const checks = {
  VITE_SUPABASE_URL: /VITE_SUPABASE_URL=/i.test(env),
  VITE_SUPABASE_ANON_KEY: /VITE_SUPABASE_ANON_KEY=/i.test(env),
};

console.log('Supabase environment check');
console.log('==========================');
console.log(`.env exists: ${hasEnv ? 'yes' : 'no'}`);
Object.entries(checks).forEach(([key, value]) => {
  console.log(`${key}: ${value ? 'configured' : 'missing'}`);
});

if (!Object.values(checks).every(Boolean)) {
  console.log('\nAdd the following to your .env file:');
  console.log('VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

console.log('\nEnvironment looks ready for Supabase integration.');
