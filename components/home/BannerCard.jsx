import Link from "next/link";
import Image from "next/image";
import CardWithBackground from "@/components/home/CardWithBackground";
import { getPlaceholderDataURL } from "@/utils/DataURL";

export default function BannerCard({ bannerBook, bannerBackground }) {
  return (
    <CardWithBackground
      asLink
      className="relative w-1/2 h-52 sm:h-48 rounded-[15px] overflow-hidden p-[25px_20px]"
      backgroundImage={bannerBackground}
      href={`/details/${bannerBook.id}`}
    >
      <div className="relative flex flex-col w-full sm:w-2/3 items-center z-10">
        <p className="text-xs md:text-base text-center">Most Érkezett</p>
        <h2 className="text-base md:text-xl lg:text-3xl text-center line-clamp-2">
          {bannerBook.title}
        </h2>
        <h3 className="text-sm md:text-lg lg:text-2xl line-clamp-1">
          {bannerBook.author}
        </h3>
      </div>

      <Image
        src={bannerBook.image}
        className="relative sm:absolute top-1/2 -translate-y-1/2 scale-150 lg:scale-100 rotate-12 -right-1/2 -translate-x-1/2 sm:right-[15%] sm:translate-x-0 w-[47px] h-[94px] sm:w-[60px] sm:h-[120px] lg:w-[94px] lg:h-[188px]"
        alt="recommended book"
        placeholder={getPlaceholderDataURL()}
        width={94}
        height={188}
      />
    </CardWithBackground>
  );
}
