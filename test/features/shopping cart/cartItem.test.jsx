import { CartItem } from "@/components/CartItem";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { generateMockBook } from "@/test/utils/mocks";
import { matchByText } from "@/test/utils/commands";

describe("Cart Item", () => {
  let container;
  const mockBook = generateMockBook();

  beforeEach(() => {
    const componentToTest = (
      <CartItem bookData={mockBook} quantity={1} outsideCart />
    );
    cleanup();
    ({ container } = render(componentToTest, { wrapper: AllWrapper }));
  });

  it("should display book image, title as link to book details, author and price", () => {
    const bookCardImage = container.querySelector(
      `img[src*="${encodeURIComponent(mockBook.image)}"]`
    );

    expect(bookCardImage).toBeTruthy();
    expect(
      screen.getByText(mockBook.title, {
        selector: `a[href="/details/${mockBook.id}"] > *`,
      })
    ).toBeTruthy();
    expect(screen.getByText(mockBook.author)).toBeTruthy();
    expect(matchByText(mockBook.price)).toBeTruthy();
  });
});
