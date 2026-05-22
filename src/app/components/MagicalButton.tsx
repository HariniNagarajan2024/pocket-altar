import { motion } from "motion/react";
import { ReactNode } from "react";

interface MagicalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
}

export function MagicalButton({ 
  children, 
  onClick, 
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
}: MagicalButtonProps) {
  const baseClasses = "rounded-full transition-all duration-300 relative overflow-hidden";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-[#d4b5e8] to-[#f5d0d9] text-white shadow-lg shadow-[#d4b5e8]/30",
    secondary: "bg-white/80 backdrop-blur-sm text-[#4a4458] border-2 border-[#d4b5e8]/30",
    ghost: "bg-transparent text-[#4a4458] hover:bg-white/50",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      animate={{
        boxShadow: variant === "primary" 
          ? ["0 0 20px rgba(212, 181, 232, 0.3)", "0 0 30px rgba(212, 181, 232, 0.5)", "0 0 20px rgba(212, 181, 232, 0.3)"]
          : undefined,
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
