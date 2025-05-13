import MarqueeCard from "@/components/home/MarqueeCard";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, within } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { generateMockBook } from "@/test/utils/mocks";
import { matchByText } from "@/test/utils/commands";

describe("Marquee Card", () => {
  let container;
  const mockBook = generateMockBook();

  beforeEach(() => {
    const ComponentToTest = <MarqueeCard book={mockBook} />;
    cleanup();
    ({ container } = render(ComponentToTest, { wrapper: AllWrapper }));
  });

  it("should display book image, title as link to book details, author, star rating, number of ratings, price and an Add to Cart button", () => {
    const marqueeContainer = container.querySelector(".marquee_card");
    const marqueeImage = marqueeContainer.querySelector(
      `img[src*="${encodeURIComponent(mockBook.image)}"]`
    );

    expect(marqueeContainer).toBeTruthy();
    expect(marqueeImage).toBeTruthy();
    expect(
      within(marqueeContainer).getByText(mockBook.title, {
        selector: `a[href="/details/${mockBook.id}"] > *`,
      })
    ).toBeTruthy();
    expect(within(marqueeContainer).getByText(mockBook.author)).toBeTruthy();
    expect(
      within(marqueeContainer).getByText(mockBook.rating + " csillag")
    ).toBeTruthy();
    expect(matchByText(mockBook.ratingsCount)).toBeTruthy();
    expect(matchByText(mockBook.price)).toBeTruthy();
    expect(marqueeContainer.querySelector(".add_to_cart_btn")).toBeTruthy();
  });
});
