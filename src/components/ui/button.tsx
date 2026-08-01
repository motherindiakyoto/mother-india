import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron-bright disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-saffron text-obsidian shadow-[0_0_28px_-8px_rgba(217,119,6,0.7)] hover:bg-saffron-bright hover:shadow-[0_0_36px_-8px_rgba(245,158,11,0.8)]",
        outline:
          "border border-white/15 bg-white/[0.03] text-cream hover:border-saffron/60 hover:bg-saffron/10 hover:text-saffron-glow",
        ghost: "text-stone-300 hover:bg-white/5 hover:text-cream",
      },
      size: {
        // Mobile keeps every control at the 44px touch minimum; desktop tightens up.
        sm: "h-11 px-4 text-sm sm:h-9",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-6 text-base sm:h-13 sm:px-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
