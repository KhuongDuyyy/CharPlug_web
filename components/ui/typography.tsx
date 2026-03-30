import { forwardRef, type ElementType, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Variant = "heading" | "body" | "caption" | "overline" | "logo";

const variantClasses: Record<Variant, string> = {
  heading: "text-xl leading-[30px] font-semibold",
  body: "text-base leading-6",
  caption: "text-sm leading-5",
  overline: "text-base uppercase tracking-wide leading-6",
  logo: "text-logo leading-[40px] font-bold tracking-[0.2px]"
};

type TypographyProps<T extends ElementType> = {
  as?: T;
  variant?: Variant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export const Typography = forwardRef<HTMLElement, TypographyProps<ElementType>>(
  function Typography({ as, variant = "body", className, children, ...props }, ref) {
    const Component = (as ?? "p") as ElementType;
    const resolvedVariant = variant as Variant;
    return (
      <Component
        {...props}
        ref={ref as never}
        className={cn("text-foreground", variantClasses[resolvedVariant], className)}
      >
        {children}
      </Component>
    );
  }
);
