import { clsx } from "clsx";
import { PropsWithChildren } from "react";

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx("card-glow rounded-2xl p-6", className)}>
      {children}
    </div>
  );
}
