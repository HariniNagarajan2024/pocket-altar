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

    let mounted = true;
    let authTimeoutId: ReturnType<typeof setTimeout> | null = null;

    // Set a timeout to ensure authLoading doesn't hang forever
    const timeoutPromise = new Promise<null>((resolve) => {
      authTimeoutId = setTimeout(() => {
        if (mounted) {
          console.warn("[Auth] getSession timeout - proceeding without session");
          setAuthLoading(false);
        }
        resolve(null);
      }, 3000); // 3 second timeout
    });

    Promise.race([
      supabase.auth.getSession(),
      timeoutPromise,
    ])
      .then(({ data: { session } } = { data: { session: null } }) => {
        if (!mounted) return;

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
      })
      .catch((error) => {
        if (!mounted) return;
        console.error("[Auth] getSession error:", error);
        setAuthLoading(false); // Ensure we don't stay stuck
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
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

    return () => {
      mounted = false;
      if (authTimeoutId) clearTimeout(authTimeoutId);
      subscription.unsubscribe();
    };
  }, [hydrated, setUser, setAuthLoading]);

  useEffect(() => {
    if (user && !user.isGuest) {
      hydrateFromCloud();
    }
  }, [user, hydrateFromCloud]);

  return <>{children}</>;
}
