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
import FiltersModal from "@/components/popovers/FiltersModal";
import dynamic from "next/dynamic";

describe("Searchbars", () => {
  let container;

  beforeEach(async () => {
    window.scrollTo = vi.fn();

    dynamic.mockReturnValueOnce(FiltersModal);
    dynamic.mockReturnValue(SettingsModal);

    const Searchbars = (await import("@/components/header/Searchbars")).default;
    const componentToTest = <Searchbars />;
    cleanup();
    ({ container } = render(componentToTest, {
      wrapper: ReduxWrapper,
    }));
  });

  it("should display a searchbar with options and filters buttons, and a button to add more searchbars", () => {
    expect(screen.getByAltText("search filters")).toBeTruthy();
    expect(screen.getAllByRole("textbox").length).toBe(1);
    expect(container.querySelectorAll("button.settings_btn").length).toBe(1);
    expect(screen.getByAltText("add searchbar")).toBeTruthy();
  });

  it("should add a new searchbar", () => {
    const addButton = container.querySelector("button.add_btn");

    fireEvent.click(addButton);

    expect(screen.getAllByRole("textbox").length).toBe(2);
  });

  it("should remove a searchbar if it's not the first", async () => {
    const addButton = container.querySelector("button.add_btn");

    fireEvent.click(addButton);
    const allButtons = screen.getAllByRole("button");
    const removeButton = allButtons[allButtons.length - 1];

    fireEvent.click(removeButton);

    await waitFor(() => {
      expect(screen.getAllByRole("textbox").length).toBe(1);
    });
  });

  it("should replace add button with collapse button if there are 4 searchbars on screen", () => {
    const addButton = container.querySelector("button.add_btn");
    expect(screen.getByAltText("add searchbar")).toBeTruthy();

    fireEvent.click(addButton);
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(screen.getAllByRole("textbox").length).toBe(4);
    expect(screen.queryByAltText("add searchbar")).toBeFalsy();
    expect(screen.getByAltText("collapse searchbars")).toBeTruthy();
  });
});
