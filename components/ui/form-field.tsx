"use client";

import { useId, useState } from "react";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils/cn";

type FormFieldProps = {
  label: string;
  error?: string | null;
  multiline?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function FormField({
  label,
  error,
  className,
  multiline,
  type,
  ...props
}: FormFieldProps) {
  const id = useId();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (isPasswordVisible ? "text" : "password") : type;
  const sharedClassName = cn(
    "w-full rounded-xl border border-border bg-input px-4 py-3 text-base text-foreground outline-none transition-shadow placeholder:text-muted",
    "focus:border-accent focus:ring-2 focus:ring-accent-soft",
    isPassword && "pr-12",
    multiline && "min-h-[180px] resize-none",
    className
  );

  return (
    <label className="block space-y-2" htmlFor={id}>
      <Typography as="span" variant="overline" className="text-muted-light">
        {label}
      </Typography>

      <div className="relative">
        {multiline ? (
          <textarea id={id} {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} className={sharedClassName} />
        ) : (
          <input id={id} {...(props as React.InputHTMLAttributes<HTMLInputElement>)} type={actualType} className={sharedClassName} />
        )}

        {isPassword ? (
          <button
            type="button"
            onClick={() => setIsPasswordVisible((value) => !value)}
            className="absolute inset-y-0 right-4 flex items-center text-muted"
          >
            <IconSymbol name={isPasswordVisible ? "xmark" : "checkmark"} size={16} />
          </button>
        ) : null}
      </div>

      {error ? (
        <Typography as="span" variant="body" className="text-danger">
          {error}
        </Typography>
      ) : null}
    </label>
  );
}
