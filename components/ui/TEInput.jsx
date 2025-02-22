"use client";

import React from "react";
import { cn } from "@/utils";
import dynamic from "next/dynamic";
const TEInput = dynamic(
  () => import("tw-elements-react").then((res) => res.TEInput),
  { ssr: false }
);

const FormInput = React.forwardRef(
  ({ id, placeholder, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative", className)}>
        <TEInput
          type="text"
          id={id}
          key={id}
          label={placeholder}
          theme={{
            focusedNotchLeadingDefault:
              "shadow-[-1px_0_0_#84cc16,_0_1px_0_0_#84cc16,_0_-1px_0_0_#84cc16] border-none dark:shadow-[-1px_0_0_#54b4d3,_0_1px_0_0_#54b4d3,_0_-1px_0_0_#54b4d3]",
            focusedNotchMiddleDefault:
              "shadow-[0_1px_0_0_#84cc16] border-none dark:shadow-[0_1px_0_0_#54b4d3]",
            focusedNotchTrailingDefault:
              "shadow-[1px_0_0_#84cc16,_0_-1px_0_0_#84cc16,_0_1px_0_0_#84cc16] border-none dark:shadow-[1px_0_0_#54b4d3,_0_-1px_0_0_#54b4d3,_0_1px_0_0_#54b4d3]",
            labelDefault:
              "pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate text-neutral-500 transition-all duration-200 ease-out peer-focus:scale-[0.8] peer-focus:text-green motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-info",
          }}
          {...props}
        ></TEInput>
      </div>
    );
  }
);

export default FormInput;
