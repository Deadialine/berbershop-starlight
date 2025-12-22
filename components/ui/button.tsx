import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", loading = false, children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";
    const variants: Record<typeof variant, string> = {
      primary: "bg-gradient-to-r from-accent-cyan to-accent-emerald text-charcoal shadow-glow hover:brightness-110",
      secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/15",
      ghost: "text-white hover:bg-white/5 border border-transparent",
    };
    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], className, loading && "opacity-80 cursor-not-allowed")}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? "Processing..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";
