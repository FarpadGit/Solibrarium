import BookReviews from "@/app/(home)/@bookreviews/page";
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { act, cleanup, render, within } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { generateMockReview, mockBook } from "@/test/utils/mocks";
import axios from "axios";

export function testsForBookReviews() {
  describe("Book Reviews", () => {
    let componentToTest, container, rerender;

    let { intersectCallback, ScrollAndOverlapsPath } = vi.hoisted(() => {
      let intersectCallback;
      const ScrollAndOverlapsPath = "@/utils/ScrollAndOverlaps";
      return { intersectCallback, ScrollAndOverlapsPath };
    });

    beforeAll(() => {
      // replace inViewportItem with a function that saves the callback method into a variable so we can call it later manually
      vi.mock(ScrollAndOverlapsPath, async () => {
        const actual = await vi.importActual(ScrollAndOverlapsPath);
        return {
          ...actual,
          inViewportItem: (obs, cb) => {
            intersectCallback = cb;
            return obs;
          },
        };
      });
    });

    beforeEach(() => {
      componentToTest = <BookReviews />;
      cleanup();
      ({ container, rerender } = render(componentToTest, {
        wrapper: AllWrapper,
      }));
    });

    it("should display a loading screen", async () => {
      const reviewCards = Array.from(
        container.querySelectorAll(".review_card")
      );

      expect(container.querySelector(".loading_text")).toBeTruthy();
      expect(reviewCards.length).toBe(0);
    });

    it("should display 9 review cards", async () => {
      axios.request.mockResolvedValue({
        get data() {
          return Array.from({ length: 9 }, () => generateMockReview());
        },
      });

      // trigger inViewportItem callback and rerender component now that it's "visible"
      await act(async () => {
        await intersectCallback();
        rerender(componentToTest);
      });
      const reviewCards = Array.from(
        container.querySelectorAll(".review_card")
      );

      expect(container.querySelector(".separator_label_text")).toBeTruthy();
      expect(reviewCards.length).toBe(9);
      reviewCards.forEach((reviewCard) => {
        expect(within(reviewCard).getByText(mockBook.title)).toBeTruthy();
        expect(within(reviewCard).getByText(mockBook.author)).toBeTruthy();
      });
    });

    afterAll(() => {
      vi.doUnmock(ScrollAndOverlapsPath);
    });
  });
}
