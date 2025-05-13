import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ReduxWrapper } from "@/test/utils/wrappers";
import SettingsModal from "@/components/popovers/SettingsModal";
import { SearchENUM } from "@/utils/SearchENUM";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import axios from "axios";

describe("Searchbar", () => {
  let Searchbar;
  let container;
  const clickSpy = vi.fn();
  const pushSpy = vi.fn();

  beforeEach(async () => {
    window.scrollTo = vi.fn();
    useRouter.mockReturnValue({ push: pushSpy });
    usePathname.mockReturnValue("/");
    dynamic.mockReturnValue(SettingsModal);
    Searchbar = (await import("@/components/header/Searchbar")).default;
  });

  describe("First Searchbar", () => {
    beforeEach(() => {
      const componentToTest = (
        <Searchbar click={clickSpy} id={0} type={SearchENUM.title} />
      );
      cleanup();
      ({ container } = render(componentToTest, {
        wrapper: ReduxWrapper,
      }));
    });

    it("should display a searchbar with an options button and a button to add searchbars", () => {
      expect(screen.getByRole("textbox")).toBeTruthy();
      expect(container.querySelector("button.settings_btn")).toBeTruthy();
      expect(screen.getByAltText("add searchbar")).toBeTruthy();
    });

    it("should navigate to Search page if user types something into the searchbar", async () => {
      const searchValue = "Testing...";
      axios.request.mockResolvedValue({ data: [] });

      fireEvent.change(screen.getByRole("textbox"), {
        target: { value: searchValue },
      });

      await waitFor(() => {
        expect(screen.getByRole("textbox").value).toBe(searchValue);
        expect(pushSpy).toHaveBeenCalledWith("/search");
      });
    });

    it("should open a modal with searchbar type options if Options button is pressed", () => {
      const optionsButton = container.querySelector("button.settings_btn");

      fireEvent.click(optionsButton);

      expect(screen.getAllByRole("radio").length).toBeGreaterThan(0);
    });
  });

  describe("Added Searchbar", () => {
    beforeEach(() => {
      const componentToTest = (
        <Searchbar click={clickSpy} id={1} type={SearchENUM.author} />
      );
      cleanup();
      ({ container } = render(componentToTest, {
        wrapper: ReduxWrapper,
      }));
    });

    it("should display a searchbar with an options button and a button to remove searchbars", () => {
      expect(screen.getByRole("textbox")).toBeTruthy();
      expect(container.querySelector("button.settings_btn")).toBeTruthy();
      expect(screen.getByAltText("remove searchbar")).toBeTruthy();
    });
  });
});
