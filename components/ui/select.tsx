import { forwardRef, SelectHTMLAttributes } from "react";
import { clsx } from "clsx";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={clsx(
        "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white shadow-inner",
        "focus:border-accent-cyan focus:ring-2 focus:ring-accent-cyan/40",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);

Select.displayName = "Select";
