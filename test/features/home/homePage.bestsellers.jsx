import BestSellers from "@/app/(home)/@bestsellers/page";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { within } from "@testing-library/react";

import { generateMockGoogleBookResponse, mockBook } from "@/test/utils/mocks";
import { renderAsync } from "@/test/utils/commands";
import axios from "axios";

export function testsForBestsellers() {
  describe("Bestsellers", () => {
    let container;

    beforeEach(() => {
      window.IntersectionObserver = vi.fn().mockReturnValue({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      });
    });

    it("should display a loading screen", async () => {
      axios.request.mockResolvedValueOnce({ data: {} });
      ({ container } = await renderAsync(BestSellers));

      expect(container.querySelector(".loading_text")).toBeTruthy();
      expect(container.querySelector(".hero-banner-container")).toBeFalsy();
    });

    it("should display quick links, a hero banner, 2 sub banners, a separator and marquee element", async () => {
      axios.request.mockResolvedValue({
        get data() {
          return generateMockGoogleBookResponse();
        },
      });
      ({ container } = await renderAsync(BestSellers));

      const quickLinks = container.querySelector("#QuickLinks");
      const heroBanner = container.querySelector(".hero-banner-container");
      const subBanners = Array.from(
        container.querySelectorAll(".banner-container")
      );
      // exclude the hero banner
      subBanners.shift();
      const marquee = container.querySelector(".marquee_container");

      expect(quickLinks).toBeTruthy();
      expect(heroBanner).toBeTruthy();
      expect(subBanners.length).toBe(2);
      expect(container.querySelector(".separator_label_text")).toBeTruthy();
      expect(marquee).toBeTruthy();
      expect(within(heroBanner).getByText(mockBook.title)).toBeTruthy();
      expect(within(heroBanner).getByText(mockBook.author)).toBeTruthy();
      expect(
        within(heroBanner).getByText(mockBook.description, {
          collapseWhitespace: false,
        })
      ).toBeTruthy();
      subBanners.forEach((banner) => {
        expect(within(banner).getByText(mockBook.title)).toBeTruthy();
        expect(within(banner).getByText(mockBook.subtitle)).toBeTruthy();
        expect(within(banner).getByText(mockBook.author)).toBeTruthy();
      });
      expect(
        within(marquee).getAllByText(mockBook.title).length
      ).toBeGreaterThan(0);
      expect(
        within(marquee).getAllByText(mockBook.author).length
      ).toBeGreaterThan(0);
    });
  });
}
