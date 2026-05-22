import { Outlet } from "react-router";
import { BottomNav } from "./BottomNav";
import { DeferredParticles } from "../DeferredParticles";
import { useAppStore, altarThemes } from "@/store/useAppStore";

export function AppShell() {
  const theme = useAppStore((s) => s.preferences.altarTheme);
  const themeConfig = altarThemes[theme];

  return (
    <div
      className={`min-h-[100dvh] bg-gradient-to-b ${themeConfig.gradient} relative`}
    >
      <DeferredParticles type="stars" count={5} color={themeConfig.accent} delayMs={600} />
      <Outlet />
      <BottomNav />
    </div>
  );
}
