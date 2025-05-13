import Search from "@/app/search/page";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { generateMockBook, mockBook } from "@/test/utils/mocks";
import { matchByText } from "@/test/utils/commands";

describe("Search Page", () => {
  let container;
  let useSelector;

  const mockReduxState = {
    bookResults: [],
    searchString: "",
    isLoading: false,
    hasMore: false,
    wasError: false,
  };

  function renderComponent() {
    const componentToTest = <Search />;
    cleanup();
    ({ container } = render(componentToTest, {
      wrapper: AllWrapper,
    }));
  }

  // sending up variables for vi.mock so they can also be reused here
  let { reactReduxPath, ScrollAndOverlapsPath, mockResultsLength } = vi.hoisted(
    () => {
      const reactReduxPath = "react-redux";
      const ScrollAndOverlapsPath = "@/utils/ScrollAndOverlaps";
      const mockResultsLength = 4;
      return {
        reactReduxPath,
        ScrollAndOverlapsPath,
        mockResultsLength,
      };
    }
  );

  beforeAll(async () => {
    // mocking lastItem observer for infinite scroller
    vi.mock(ScrollAndOverlapsPath);

    // mocking redux to later set mock search results coming from there
    vi.mock(reactReduxPath, async () => {
      const actual = await vi.importActual(reactReduxPath);
      return {
        ...actual,
        useSelector: vi.fn(),
        useDispatch: vi.fn(),
      };
    });

    useSelector = (await import(reactReduxPath)).useSelector;
  });

  it("should display search cards", () => {
    useSelector.mockReturnValue({
      ...mockReduxState,
      bookResults: Array.from({ length: mockResultsLength }, () =>
        generateMockBook()
      ),
    });

    renderComponent();
    const bookCards = Array.from(container.querySelectorAll(".book_card"));

    expect(bookCards.length).toBe(mockResultsLength);
    bookCards.forEach((bookCard) => {
      expect(within(bookCard).getByText(mockBook.title)).toBeTruthy();
      expect(within(bookCard).getByText(mockBook.author)).toBeTruthy();
    });
  });

  it("should display a message if search results are empty", async () => {
    useSelector.mockReturnValue(mockReduxState);

    renderComponent();
    const bookCards = Array.from(container.querySelectorAll(".book_card"));

    expect(bookCards.length).toBe(0);
    expect(screen.getByText("Nincs találat")).toBeTruthy();
  });

  it("should display search query text", () => {
    const searchString = "Fake Search Query";
    useSelector.mockReturnValue({
      ...mockReduxState,
      bookResults: [generateMockBook()],
      searchString,
    });

    renderComponent();

    expect(screen.getByText(searchString)).toBeTruthy();
  });

  it("should display loading skeleton cards", () => {
    useSelector.mockReturnValue({
      ...mockReduxState,
      bookResults: [],
      isLoading: true,
    });

    renderComponent();

    expect(screen.getAllByTestId("BookCardSkeleton").length).toBe(3);
  });

  it("should display an error message", () => {
    useSelector.mockReturnValue({
      ...mockReduxState,
      wasError: true,
    });

    renderComponent();
    const bookCards = Array.from(container.querySelectorAll(".book_card"));

    expect(bookCards.length).toBe(0);
    expect(matchByText("hiba")).toBeTruthy();
  });

  it("should display placeholder search cards when conducting a new search", () => {
    useSelector.mockReturnValue({
      ...mockReduxState,
      bookResults: Array.from({ length: mockResultsLength }, (_, index) => ({
        id: index,
        placeholder: true,
      })),
    });

    renderComponent();

    expect(screen.getAllByTestId("BookCardSkeleton").length).toBe(
      mockResultsLength
    );
  });

  afterAll(() => {
    vi.doUnmock(reactReduxPath);
    vi.doUnmock(ScrollAndOverlapsPath);
  });
});
