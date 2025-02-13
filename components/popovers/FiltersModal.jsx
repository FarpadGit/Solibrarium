import Image from "next/image";
import { useFilterContext } from "@/contexts/FilterContext";
import { motion } from "framer-motion";

export default function FiltersModal() {
  const {
    Price: { isFilterOn, setFilter },
  } = useFilterContext();
  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 150 }}
      className="modal flex flex-col border border-current gap-2 bg-solibrarium px-1 rounded-full overflow-hidden md:p-2"
    >
      <div className="flex">
        <input
          type="checkbox"
          id="priceFilter"
          value="price"
          checked={isFilterOn}
          onChange={(e) => setFilter(e.target.checked)}
        />
        <label
          htmlFor="priceFilter"
          className="flex items-center text-xs gap-1 md:text-base hover:cursor-pointer"
        >
          <Image
            id="priceFilterIcon"
            src="/icons/buyable.svg"
            alt="filter by available"
            width={30}
            height={30}
            className="dark:invert"
          />
          Csak megvásárolható találatok
        </label>
      </div>
    </motion.div>
  );
}
