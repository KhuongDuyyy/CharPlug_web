"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent",
  secondary: "border border-border bg-surface-alt text-foreground",
  danger: "bg-danger text-on-accent",
  ghost: "bg-transparent text-accent"
};

export const Button = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
  }
>(function Button({ className, variant = "primary", fullWidth = true, ...props }, ref) {
  return (
    <button
      {...props}
      ref={ref}
      className={cn(
        "cp-press inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-base font-semibold disabled:opacity-60",
        fullWidth && "w-full",
        variantClasses[variant],
        className
      )}
    />
  );
});
