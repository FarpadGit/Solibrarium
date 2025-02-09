import { cn } from "@/utils";
import Link from "next/link";

export default function CardWithBackground({
  className = undefined,
  backgroundImage,
  children,
  asLink = false,
  ...args
}) {
  const Socket = asLink ? Link : "div";
  return (
    <Socket
      className={cn("banner-container", className)}
      style={{ backgroundImage: `url(/banner/${backgroundImage})` }}
      {...args}
    >
      {children}
    </Socket>
  );
}
