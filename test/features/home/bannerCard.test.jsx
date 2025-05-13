import BannerCard from "@/components/home/BannerCard";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import { generateMockBook } from "@/test/utils/mocks";

describe("Banner Card", () => {
  let container;
  const mockBook = generateMockBook();

  beforeEach(() => {
    const componentToTest = (
      <BannerCard bannerBook={mockBook} bannerBackground="" />
    );
    cleanup();
    ({ container } = render(componentToTest));
  });

  it("should display book title, author, subtitle and image in a clickable link to book details", async () => {
    const bannerElement = container.querySelector(".banner-container");
    const bannerImage = bannerElement.querySelector(
      `img[src*="${encodeURIComponent(mockBook.image)}"]`
    );

    expect(bannerElement).toBeTruthy();
    expect(
      container.querySelector(`a[href="/details/${mockBook.id}"]`)
    ).toBeTruthy();
    expect(within(bannerElement).getByText(mockBook.title)).toBeTruthy();
    expect(within(bannerElement).getByText(mockBook.author)).toBeTruthy();
    expect(within(bannerElement).getByText(mockBook.subtitle)).toBeTruthy();
    expect(bannerImage).toBeTruthy();
  });
});
