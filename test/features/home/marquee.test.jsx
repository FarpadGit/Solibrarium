import Marquee from "@/components/home/Marquee";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { generateMockBook } from "@/test/utils/mocks";

describe("Marquee", () => {
  let container;
  const numberOfBooks = 5;
  const mockBooks = Array.from({ length: numberOfBooks }, () =>
    generateMockBook()
  );

  beforeEach(() => {
    window.IntersectionObserver = vi.fn().mockReturnValue({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    });

    const ComponentToTest = <Marquee frontPageBooks={mockBooks} />;
    cleanup();
    ({ container } = render(ComponentToTest, { wrapper: AllWrapper }));
  });

  it("should display 2 sets of books", () => {
    const marqueeContainer = container.querySelector(".marquee_container");
    const marqueeCards = Array.from(
      marqueeContainer.querySelectorAll(".marquee_card")
    );

    expect(marqueeContainer).toBeTruthy();
    expect(marqueeCards.length).toBe(2 * numberOfBooks);
    for (let i = 0; i < numberOfBooks; i++) {
      const linkFrom1stSet = marqueeCards[i].querySelector("a").href;
      const linkFrom2ndSet =
        marqueeCards[numberOfBooks + i].querySelector("a").href;

      expect(linkFrom1stSet).toBe(linkFrom2ndSet);
    }
  });
});
