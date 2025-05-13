import HeroBanner from "@/components/home/HeroBanner";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import { generateMockBook } from "@/test/utils/mocks";

describe("Hero Banner", () => {
  let container;
  const mockBook = generateMockBook();

  beforeEach(() => {
    const componentToTest = (
      <HeroBanner bannerBook={mockBook} bannerBackground="" />
    );
    cleanup();
    ({ container } = render(componentToTest));
  });

  it("should display book title, author, description, image and a button for more info", async () => {
    const heroBannerElement = container.querySelector(".hero-banner-container");
    const heroImage = heroBannerElement.querySelector(
      `img[src*="${encodeURIComponent(mockBook.image)}"]`
    );

    expect(heroBannerElement).toBeTruthy();
    expect(within(heroBannerElement).getByText(mockBook.title)).toBeTruthy();
    expect(within(heroBannerElement).getByText(mockBook.author)).toBeTruthy();
    expect(
      within(heroBannerElement).getByText(mockBook.description, {
        collapseWhitespace: false,
      })
    ).toBeTruthy();
    expect(heroImage).toBeTruthy();
    expect(
      within(heroBannerElement).getByText("Érdekel", { selector: "a" })
    ).toBeTruthy();
  });
});
