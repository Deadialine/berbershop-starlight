import { forwardRef, InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/50 shadow-inner",
          "focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/40",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
