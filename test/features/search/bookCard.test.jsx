import BookCard from "@/components/search/BookCard";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, within } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { generateMockBook } from "@/test/utils/mocks";
import { matchByText } from "@/test/utils/commands";

describe("Book Card", () => {
  let container;
  const mockBook = generateMockBook();

  beforeEach(() => {
    const componentToTest = <BookCard book={mockBook} />;
    cleanup();
    ({ container } = render(componentToTest, { wrapper: AllWrapper }));
  });

  it("should display book image, title as link to book details, author, description, price, ISBN number and an Add to Cart button", () => {
    const bookCardContainer = container.querySelector(".book_card");
    const bookCardImage = bookCardContainer.querySelector(
      `img[src*="${encodeURIComponent(mockBook.image)}"]`
    );

    expect(bookCardContainer).toBeTruthy();
    expect(bookCardImage).toBeTruthy();
    expect(
      within(bookCardContainer).getByText(mockBook.title, {
        selector: `a[href="/details/${mockBook.id}"] > *`,
      })
    ).toBeTruthy();
    expect(within(bookCardContainer).getByText(mockBook.author)).toBeTruthy();
    expect(
      within(bookCardContainer).getByText(mockBook.description, {
        collapseWhitespace: false,
      })
    ).toBeTruthy();
    expect(matchByText(mockBook.price)).toBeTruthy();
    expect(matchByText(mockBook.ISBN10)).toBeTruthy();
    expect(bookCardContainer.querySelector(".add_to_cart_btn")).toBeTruthy();
  });

  it("should not display an Add to Cart button if book has no price", () => {
    const unavailableBook = { ...mockBook, price: null };
    const componentToTest = <BookCard book={unavailableBook} />;
    cleanup();

    ({ container } = render(componentToTest, { wrapper: AllWrapper }));
    const bookCardContainer = container.querySelector(".book_card");

    expect(bookCardContainer.querySelector(".add_to_cart_btn")).toBeFalsy();
  });
});
