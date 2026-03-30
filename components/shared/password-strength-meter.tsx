"use client";

import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils/cn";
import { getPasswordStrength } from "@/lib/utils/validation";

export function PasswordStrengthMeter({
  hint,
  password
}: {
  hint: string;
  password: string;
}) {
  const strength = getPasswordStrength(password);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full",
              strength >= index ? "bg-success" : "bg-border"
            )}
          />
        ))}
      </div>
      <Typography variant="caption" className="text-muted">
        {hint}
      </Typography>
    </div>
  );
}
