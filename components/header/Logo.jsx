import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { useSelector } from "react-redux";
import { selector as headerVisibilitySelector } from "@/redux/features/headerVisibility/headerVisibilitySlice";
import { selector as searchbarsSelector } from "@/redux/features/searchbars/searchbarsSlice";

export default function Logo() {
  const { darkMode } = useAppContext();
  const { isHeaderMinimized } = useSelector(headerVisibilitySelector);
  const { currentSearchBarCount } = useSelector(searchbarsSelector);
  return (
    <Link
      href="/"
      className="relative w-2/12 h-full flex gap-2 transition-transform hover:scale-[1.05]"
    >
      <div className="relative md:absolute top-0 left-0 w-full h-full">
        <Image
          src={
            !darkMode ? "/solibrarium_logo.png" : "/solibrarium_logo_night.png"
          }
          alt="logo"
          fill
          className={`object-contain transition-[object_position_0.5s_ease] ${
            currentSearchBarCount === 1 || isHeaderMinimized
              ? "object-[50%] lg:object-[0%]"
              : "object-[50%]"
          }`}
        />
        <p
          className="logo_text drop-shadow-star"
          data-indented={
            currentSearchBarCount === 1 || isHeaderMinimized ? "" : undefined
          }
        >
          Solibrarium
        </p>
        {/* webkit fallback */}
        <div className="logo_img"></div>
      </div>
    </Link>
  );
}
