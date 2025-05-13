import QuickLinks from "@/components/home/QuickLinks";
import HeroBanner from "@/components/home/HeroBanner";
import BannerCard from "@/components/home/BannerCard";
import Marquee from "@/components/home/Marquee";
import Loading from "@/components/Loading";
import { getBestsellers } from "@/app/(home)/@bestsellers/bestsellers";
import bannerBackgroundImages from "@/public/banner/banners.json";

export default async function BestSellers() {
  const frontPageBooks = await getBestsellers();

  if (frontPageBooks.length === 0) return <Loading />;
  if (frontPageBooks.error) return <Loading />;

  function getRandomBannerBook(count = 1) {
    const indices = getUniqueRandomIndices(count, frontPageBooks.length);
    return indices.map((index) => frontPageBooks[index]);
  }

  function getRandomBackgroundImage() {
    return bannerBackgroundImages[getRandomIndex(bannerBackgroundImages.length)]
      .name;
  }

  function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  function getUniqueRandomIndices(count, length) {
    let results = [];
    while (results.length < count) {
      const index = getRandomIndex(length);
      if (!results.includes(index)) results.push(index);
    }

    return results;
  }

  const bannerBooks = getRandomBannerBook(3);

  return (
    <>
      <QuickLinks />
      <div className="flex flex-col gap-10">
        <HeroBanner
          bannerBook={bannerBooks[0]}
          bannerBackground={getRandomBackgroundImage()}
        />
        <div className="flex flex-col sm:flex-row w-full gap-5">
          <BannerCard
            bannerBook={bannerBooks[1]}
            bannerBackground={getRandomBackgroundImage()}
          />
          <BannerCard
            bannerBook={bannerBooks[2]}
            bannerBackground={getRandomBackgroundImage()}
          />
        </div>
        <div className="w-full">
          <h3 className="separator_label_text">További kiemelt könyvek</h3>
          <Marquee frontPageBooks={frontPageBooks} />
        </div>
      </div>
    </>
  );
}
