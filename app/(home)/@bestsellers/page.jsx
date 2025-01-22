import HeroBanner from "@/components/home/HeroBanner";
import Marquee from "@/components/home/Marquee";
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
    "engrossed_leaves.jpg",
    "golden_glitter.jpg",
    "green-fluid-wave.jpg",
    "low-poly-rust.jpg",
    "red_and_white.jpg",
    "red-fluid-wave.jpg",
    "watercolor_flowers.jpg",
    "watercolor-background.jpg",
  ];

  if (frontPageBooks.length === 0) return <Loading />;
  if (frontPageBooks.error) return <Loading />;

  const bannerBook = frontPageBooks[getRandomIndex(frontPageBooks.length)];
  const bannerBackground =
    bannerBackgroundImages[getRandomIndex(bannerBackgroundImages.length)];

  return (
    <>
      <HeroBanner bannerBook={bannerBook} bannerBackground={bannerBackground} />
      <div className="w-full">
        <h2 className="separator_label_text">További kiemelt könyvek</h2>
        <Marquee frontPageBooks={frontPageBooks} />
      </div>
    </>
  );
}
