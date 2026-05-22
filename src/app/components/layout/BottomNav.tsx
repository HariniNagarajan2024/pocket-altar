import { motion } from "motion/react";
import { NavLink } from "react-router";
import { Home, Sparkles, BookHeart, Image, User } from "lucide-react";

const navItems = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/rituals", label: "Rituals", icon: Sparkles },
  { to: "/archive", label: "Casted", icon: BookHeart },
  { to: "/wallpapers", label: "Wallpapers", icon: Image },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 px-4 pt-2 pointer-events-none safe-bottom">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="flex justify-around items-center px-2 py-3 rounded-[2rem] backdrop-blur-xl bg-white/75 border border-[#d4b5e8]/30 shadow-[0_8px_32px_rgba(212,181,232,0.25)]">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="relative flex flex-col items-center gap-0.5 min-w-[56px]">
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-glow"
                      className="absolute -inset-1 rounded-2xl bg-[#d4b5e8]/25"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <motion.span
                    className="relative z-10"
                    whileTap={{ scale: 0.9 }}
                    animate={isActive ? { y: -2 } : { y: 0 }}
                  >
                    <Icon
                      size={22}
                      className={isActive ? "text-[#9b7ec8]" : "text-[#8a7d9e]"}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </motion.span>
                  <span
                    className={`relative z-10 text-[10px] font-medium ${
                      isActive ? "text-[#9b7ec8]" : "text-[#8a7d9e]"
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
