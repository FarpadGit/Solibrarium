import Link from "next/link";
import Image from "next/image";
import CardWithBackground from "@/components/home/CardWithBackground";
import { getPlaceholderDataURL } from "@/utils/DataURL";

export default function BannerCard({ bannerBook, bannerBackground }) {
  return (
    <CardWithBackground
      asLink
      className="relative w-full h-52 sm:h-48 rounded-[15px] overflow-hidden p-[25px_20px]"
      backgroundImage={bannerBackground}
      href={`/details/${bannerBook.id}`}
    >
      <div className="relative flex flex-col gap-2 w-2/3 items-center text-black min-h-full max-h-[110%] line-clamp-5">
        <p className="banner-sub">Most Érkezett</p>
        <h2 className="banner-title line-clamp-2 outlined">
          {bannerBook.title}
        </h2>
        <h3 className="banner-author outlined">{bannerBook.author}</h3>
        {bannerBook.subtitle && (
          <h3 className="banner-tagline">{bannerBook.subtitle}</h3>
        )}
      </div>

      <Image
        src={bannerBook.image}
        className="absolute top-1/2 -translate-y-1/2 scale-150 sm:scale-125 lg:scale-100 rotate-12 -translate-x-1/2 right-[7.5%] md:right-[15%] sm:translate-x-0 w-[47px] h-[94px] sm:w-[60px] sm:h-[120px] lg:w-[94px] lg:h-[188px]"
        alt="recommended book"
        placeholder={getPlaceholderDataURL()}
        width={94}
        height={188}
      />
    </CardWithBackground>
  );
}
