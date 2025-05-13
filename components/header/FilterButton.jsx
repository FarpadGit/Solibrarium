import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
const FiltersModal = dynamic(
  () => import("@/components/popovers/FiltersModal").then((res) => res.default),
  { ssr: false }
);

export default function FilterButton() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="filters_btn header_icon_btn">
          <Image
            src="/icons/filter.svg"
            alt="search filters"
            width={20}
            height={20}
            className="md:w-[30px] md:h-[30px]"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" side="left">
        <AnimatePresence>
          <FiltersModal />
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
