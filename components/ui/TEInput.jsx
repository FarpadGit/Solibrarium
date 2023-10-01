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
              "shadow-[-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca] border-primary dark:border-info",
            focusedNotchMiddleDefault:
              "shadow-[0_1px_0_0_#3b71ca] border-primary dark:border-info",
            focusedNotchTrailingDefault:
              "shadow-[1px_0_0_#3b71ca,_0_-1px_0_0_#3b71ca,_0_1px_0_0_#3b71ca] border-primary dark:border-info",
            label:
              "pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate text-neutral-500 transition-all duration-200 ease-out peer-focus:scale-[0.8] peer-focus:text-primary motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-info",
          }}
          {...props}
        ></TEInput>
      </div>
    );
  }
);

export default FormInput;
