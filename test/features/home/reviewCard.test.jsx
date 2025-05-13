import ReviewCard from "@/components/home/ReviewCard";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, within } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { generateMockBook } from "@/test/utils/mocks";
import { matchByText } from "@/test/utils/commands";

describe("Review Card", () => {
  let container;
  const mockBook = generateMockBook();
  const reviewText = "Fake Review Text";

  beforeEach(() => {
    const componentToTest = (
      <ReviewCard book={mockBook} reviewText={reviewText} rating={5} />
    );
    cleanup();
    ({ container } = render(componentToTest, { wrapper: AllWrapper }));
  });

  it("should display book image, title as link to book details, author, price, star rating, supplied review text and an Add to Cart button", () => {
    const reviewContainer = container.querySelector(".review_card");
    const reviewCardImage = reviewContainer.querySelector(
      `img[src*="${encodeURIComponent(mockBook.image)}"]`
    );

    expect(reviewContainer).toBeTruthy();
    expect(reviewCardImage).toBeTruthy();
    expect(
      within(reviewContainer).getByText(mockBook.title, {
        selector: `a[href="/details/${mockBook.id}"] > *`,
      })
    ).toBeTruthy();
    expect(within(reviewContainer).getByText(mockBook.author)).toBeTruthy();
    expect(
      within(reviewContainer).getByText(mockBook.rating + " csillag")
    ).toBeTruthy();
    expect(matchByText(mockBook.price)).toBeTruthy();
    expect(matchByText(reviewText)).toBeTruthy();
    expect(reviewContainer.querySelector(".add_to_cart_btn")).toBeTruthy();
  });
});
