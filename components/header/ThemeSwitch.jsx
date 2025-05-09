"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/utils";

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[18px] w-[40px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-shadcn_ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-theme-switch-on data-[state=unchecked]:bg-theme-switch-off",
      "md:h-[20px] md:w-[44px]",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-3 w-3 rounded-full shadow-lg ring-0 transition-[transform] data-[state=checked]:bg-theme-switch-thumb-on data-[state=unchecked]:bg-theme-switch-thumb-off data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0",
        "md:h-4 md:w-4"
      )}
      style={{
        transitionTimingFunction: "cubic-bezier(1,0,0,1)",
        transitionDuration: "500ms",
      }}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch as ThemeSwitch };
