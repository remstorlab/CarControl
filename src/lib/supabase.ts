import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export const isSupabaseReady = Boolean(supabase);

export const validateEmail = (value: string) => {
  const normalized = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
};

export const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env file.');
  }

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName ?? '',
      },
    },
  });
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env file.');
  }

  return supabase.auth.signInWithPassword({ email, password });
};

export const signOutFromSupabase = async () => {
  if (!supabase) {
    return;
  }

  return supabase.auth.signOut();
};

export const getProfileByUserId = async (userId: string) => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, avatar')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }

    throw error;
  }

  return data;
};

export const updateProfile = async (updates: { full_name?: string; avatar?: string | null; email?: string | null }) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env file.');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    throw userError ?? new Error('User is not authenticated.');
  }

  const nextEmail = updates.email?.trim() || user.email || '';

  if (nextEmail && nextEmail !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email: nextEmail });
    if (emailError) {
      throw emailError;
    }
  }

  if (updates.full_name !== undefined) {
    const { error: profileMetaError } = await supabase.auth.updateUser({
      data: {
        full_name: updates.full_name.trim(),
      },
    });

    if (profileMetaError) {
      throw profileMetaError;
    }
  }

  const payload = {
    id: user.id,
    email: nextEmail,
    full_name: updates.full_name?.trim() || user.user_metadata?.full_name || null,
    avatar: updates.avatar ?? null,
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(payload)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const changePassword = async (newPassword: string) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env file.');
  }

  const normalized = newPassword.trim();
  if (normalized.length < 6) {
    throw new Error('Пароль должен содержать минимум 6 символов.');
  }

  const { data, error } = await supabase.auth.updateUser({ password: normalized });

  if (error) {
    throw error;
  }

  return data;
};

export const uploadUserAvatar = async (file: File) => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your env file.');
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw userError ?? new Error('User is not authenticated.');
  }

  const extension = file.name.includes('.') ? file.name.split('.').pop() : 'png';
  const path = `${user.id}/avatar-${Date.now()}.${extension ?? 'png'}`;

  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return data.publicUrl;
};
