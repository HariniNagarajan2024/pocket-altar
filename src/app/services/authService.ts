import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";

export async function signUp(email: string, password: string, displayName: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured. Add credentials to .env");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw error;

  if (data.user) {
    useAppStore.getState().setUser({
      id: data.user.id,
      email,
      displayName,
      isGuest: false,
    });
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured. Add credentials to .env");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  if (data.user) {
    useAppStore.getState().setUser({
      id: data.user.id,
      email: data.user.email ?? email,
      displayName:
        data.user.user_metadata?.display_name ??
        email.split("@")[0],
      isGuest: false,
    });
    await useAppStore.getState().hydrateFromCloud();
  }
  return data;
}

export async function resetPassword(email: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = getSupabase();
  if (supabase) await supabase.auth.signOut();
  useAppStore.getState().setUser(null);
}

export function continueAsGuest() {
  useAppStore.getState().setUser({
    id: `guest-${crypto.randomUUID()}`,
    email: "",
    displayName: "Guest Keeper",
    isGuest: true,
  });
}

export function isAuthAvailable() {
  return isSupabaseConfigured;
}
