import BookReviewCard from "@/components/account/BookReviewCard";
import { describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { generateMockBook } from "@/test/utils/mocks";
import axios from "axios";
import { matchByText } from "@/test/utils/commands";

describe("Book Review Card", () => {
  let container;
  const closeSpy = vi.fn();
  const mockUserBook = generateMockBook();

  function renderComponent() {
    closeSpy.mockClear();

    const componentToTest = (
      <BookReviewCard
        bookDetails={mockUserBook}
        user={"FakeUserID"}
        close={closeSpy}
      />
    );
    cleanup();
    ({ container } = render(componentToTest, { wrapper: AllWrapper }));
  }

  it("should display image, author, title, subtitle, publisher and published date of selected book", () => {
    axios.request.mockResolvedValue({ data: {} });

    renderComponent();

    expect(
      container.querySelector(
        `img[src*="${encodeURIComponent(mockUserBook.image)}"]`
      )
    ).toBeTruthy();
    expect(screen.getByText(mockUserBook.title)).toBeTruthy();
    expect(screen.getByText(mockUserBook.subtitle)).toBeTruthy();
    expect(screen.getByText(mockUserBook.author)).toBeTruthy();
    expect(matchByText(mockUserBook.publisher)).toBeTruthy();
    expect(matchByText(mockUserBook.publishedDate)).toBeTruthy();
  });

  it("should populate review text and rating from server if they exist in database", async () => {
    const mockReviewText = "Fake Review Text";
    const mockRating = 5;
    axios.request.mockResolvedValue({
      data: { reviewText: mockReviewText, rating: mockRating },
    });

    renderComponent();

    await waitFor(() => {
      expect(container.querySelector("#ReviewTextArea").value).toBe(
        mockReviewText
      );
      expect(screen.getByText(mockRating + " csillag")).toBeTruthy();
    });
  });

  it("should close component if close button is clicked", () => {
    axios.request.mockResolvedValue({ data: {} });

    renderComponent();
    const closeButton = container.querySelector("#review_close_btn");
    fireEvent.click(closeButton);

    expect(closeSpy).toHaveBeenCalled();
  });

  it("should close component if a valid form is submitted", async () => {
    axios.request.mockResolvedValue({ data: {} });

    renderComponent();

    const reviewTextArea = container.querySelector("#ReviewTextArea");
    fireEvent.change(reviewTextArea, { target: { value: "Fake Review" } });
    const submitButton = container.querySelector("button[type='submit']");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(closeSpy).toHaveBeenCalled();
    });
  });

  it("should close component if escape key was pressed", () => {
    axios.request.mockResolvedValue({ data: {} });

    renderComponent();
    fireEvent.keyUp(container.firstElementChild, { code: "Escape" });

    expect(closeSpy).toHaveBeenCalled();
  });
});
