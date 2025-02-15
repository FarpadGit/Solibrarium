import { useId, useRef } from "react";
import SettingOption from "@/components/popovers/SettingOption";
import { SearchENUM } from "@/utils/SearchENUM";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { selector as searchbarsSelector } from "@/redux/features/searchbars/searchbarsSlice";

export default function SettingsModal({ settingSetter: setType, initialType }) {
  const id = useId();
  const types = Object.values(SearchENUM);
  const { hasSearchBarWithType } = useSelector(searchbarsSelector);

  const activeTooltipRef = useRef();
  return (
    <motion.div
      className="modal border border-current grid grid-cols-[repeat(auto-fit,_minmax(0,_1fr))] grid-flow-col gap-2 bg-solibrarium p-4 rounded-full md:p-6 md:gap-4"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      //exit={{ y: -150, opacity: 1 }}
      transition={{ type: "spring", stiffness: 150 }}
    >
      {types.map((typeName, index) => {
        return (
          (typeName === initialType || !hasSearchBarWithType(typeName)) && (
            <SettingOption
              key={`${id}_${index}`}
              id={`${id}_${index}`}
              type={typeName}
              setType={setType}
              active={typeName === initialType}
              activeTooltip={activeTooltipRef}
            />
          )
        );
      })}
    </motion.div>
  );
}
