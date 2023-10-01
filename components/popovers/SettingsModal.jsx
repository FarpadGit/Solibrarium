import { useId } from "react";
import { useSearchBarContext } from "@/contexts/SearchBarContext";
import SettingOption from "@/components/popovers/SettingOption";
import { SearchENUM } from "@/utils/SearchENUM";
import { motion } from "framer-motion";

export default function SettingsModal({ settingSetter: setType, initialType }) {
  const id = useId();
  const { hasSearchBarWithType } = useSearchBarContext();
  return (
    <motion.div
      className="modal grid grid-cols-[repeat(auto-fit,_minmax(0,_1fr))] grid-flow-col gap-0 bg-solibrarium p-4 rounded-full md:p-8 md:gap-2"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      //exit={{ y: -150, opacity: 1 }}
      transition={{ type: "spring", stiffness: 150 }}
    >
      {Object.values(SearchENUM).map((typeName, index) => {
        return (
          !(typeName !== initialType && hasSearchBarWithType(typeName)) && (
            <SettingOption
              key={`${id}_${index}`}
              id={`${id}_${index}`}
              type={typeName}
              setType={setType}
              active={typeName === initialType}
            />
          )
        );
      })}
    </motion.div>
  );
}
