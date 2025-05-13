import Details from "@/app/details/[bookID]/page";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { generateMockGoogleBookResponse, mockBook } from "@/test/utils/mocks";
import { matchByText, renderAsync } from "@/test/utils/commands";
import axios from "axios";
import { notFound } from "next/navigation";

describe("Details Page", () => {
  let container;

  it("should display a 404 page if book ID is incorrect", async () => {
    axios.request.mockResolvedValueOnce({ data: {} });
    ({ container } = await renderAsync(Details, { bookID: "FakeBookID" }));

    expect(notFound).toHaveBeenCalled();
  });

  it("should display most relevant book details on the page, including an image and Add to Cart button", async () => {
    axios.request.mockResolvedValue({
      get data() {
        return generateMockGoogleBookResponse();
      },
    });
    ({ container } = await renderAsync(Details, {
      bookID: "FakeBookID",
    }));
    const bookImage = container.querySelector(
      `img[src*="${encodeURIComponent(mockBook.image)}"]`
    );

    expect(bookImage).toBeTruthy();
    expect(screen.getByText(mockBook.rating + " csillag")).toBeTruthy();
    expect(matchByText(mockBook.ratingsCount)).toBeTruthy();
    expect(matchByText(mockBook.title)).toBeTruthy();
    expect(matchByText(mockBook.subtitle)).toBeTruthy();
    expect(matchByText(mockBook.author)).toBeTruthy();
    mockBook.categories.forEach((category) =>
      expect(matchByText(category, { selector: "a" })).toBeTruthy()
    );
    expect(matchByText(mockBook.publisher)).toBeTruthy();
    expect(matchByText(mockBook.publishedDate)).toBeTruthy();
    expect(
      screen.getByText(mockBook.description, { collapseWhitespace: false })
    ).toBeTruthy();
    expect(matchByText(mockBook.ISBN10)).toBeTruthy();
    expect(matchByText(mockBook.ISBN13)).toBeTruthy();
    Object.keys(mockBook.dimensions).forEach((dimension) =>
      expect(matchByText(mockBook.dimensions[dimension])).toBeTruthy()
    );
    expect(matchByText(mockBook.pageCount)).toBeTruthy();
    expect(matchByText(mockBook.price)).toBeTruthy();
    expect(container.querySelector(".add_to_cart_btn")).toBeTruthy();
  });
});
