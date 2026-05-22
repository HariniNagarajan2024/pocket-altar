import { useEffect, type ReactNode } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { useStoreHydrated } from "@/app/hooks/useStoreHydrated";

export function AuthProvider({ children }: { children: ReactNode }) {
  const hydrated = useStoreHydrated();
  const setUser = useAppStore((s) => s.setUser);
  const setAuthLoading = useAppStore((s) => s.setAuthLoading);
  const hydrateFromCloud = useAppStore((s) => s.hydrateFromCloud);
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    if (!hydrated) return;

    const supabase = getSupabase();

    if (!isSupabaseConfigured || !supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          displayName:
            session.user.user_metadata?.display_name ??
            session.user.email?.split("@")[0] ??
            "Magical Soul",
          isGuest: false,
        });
      }
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? "",
          displayName:
            session.user.user_metadata?.display_name ?? "Magical Soul",
          isGuest: false,
        });
      } else if (!useAppStore.getState().user?.isGuest) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [hydrated, setUser, setAuthLoading]);

  useEffect(() => {
    if (user && !user.isGuest) {
      hydrateFromCloud();
    }
  }, [user, hydrateFromCloud]);

  return <>{children}</>;
}
