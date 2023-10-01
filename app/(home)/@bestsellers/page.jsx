import MarqueeCard from "@/components/home/MarqueeCard";
import HeroBanner from "@/components/home/HeroBanner";
import Loading from "@/components/Loading";
import { getBestsellers } from "@/app/(home)/@bestsellers/bestsellers";

export default async function BestSellers() {
  const frontPageBooks = await getBestsellers();

  function getRandomIndex(length) {
    return Math.floor(Math.random() * length);
  }

  const bannerBackgroundImages = [
    "banana_leaves.png",
    "colourful_low_poly.jpg",
    "red_and_white.jpg",
    "red-fluid-wave.jpg",
    "watercolor-background.jpg",
  ];

  if (frontPageBooks.length === 0) return <Loading />;

  const bannerBook = frontPageBooks[getRandomIndex(frontPageBooks.length)];
  const bannerBackground =
    bannerBackgroundImages[getRandomIndex(bannerBackgroundImages.length)];

  return (
    <>
      <HeroBanner bannerBook={bannerBook} bannerBackground={bannerBackground} />
      <div className="w-full">
        <h2 className="separator_label_text">További kiemelt könyvek</h2>
        <div className="marquee_container">
          <div className="marquee_track">
            {frontPageBooks.map((book) => (
              <MarqueeCard key={`marqueeCard_${book.id}`} book={book} />
            ))}
            {frontPageBooks.map((book) => (
              <MarqueeCard key={`marqueeCard_2_${book.id}`} book={book} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
