import Link from "next/link";
import BannerBookCover from "@/components/home/BannerBookCover";

export default function HeroBanner({ bannerBook, bannerBackground }) {
  const style = {
    "--background_image_path": `url(/banner/${bannerBackground})`,
  };
  return (
    <div className="hero-banner-container" style={style}>
      <div className="relative w-1/2 z-0">
        <p className="hero-banner-sub">Aktuális toplistás</p>
        <h3 className="hero-banner-author">{bannerBook.author}</h3>
        <h1 className="hero-banner-title">{bannerBook.title}</h1>
        <div className="flex justify-center my-6">
          <div className="w-1/2 border border-black" />
        </div>
        <div className="hero-banner-backdrop" />
        <div className="hero-banner-desc">
          <div
            className="text-[#5f5f5f] font-thin"
            dangerouslySetInnerHTML={{ __html: bannerBook.description }}
          ></div>
        </div>
      </div>
      <Link href={`/details/${bannerBook.id}`} className="hero-banner-image">
        <BannerBookCover image={bannerBook.image} />
      </Link>
      <div className="hero-banner-button">
        <Link
          href={`/details/${bannerBook.id}`}
          className="rounded-3xl px-4 py-2 bg-[#f02d34] hover:bg-[#fb7185] text-white border-none text-sm font-medium cursor-pointer sm:text-lg sm:py-2.5"
        >
          Érdekel
        </Link>
      </div>
    </div>
  );
}
