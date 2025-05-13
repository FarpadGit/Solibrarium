import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { AllWrapper } from "@/test/utils/wrappers";
import UserMenu from "@/components/popovers/UserMenu";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { mockCartItems } from "@/test/utils/mocks";
import { useAppContext } from "@/contexts/AppContext";

describe("Header Buttons", () => {
  let HeaderButtons;
  let componentToTest;
  let container, rerender;

  beforeEach(async () => {
    useLocalStorage.mockReturnValue([mockCartItems, vi.fn()]);
    dynamic.mockReturnValue(UserMenu);
    HeaderButtons = (await import("@/components/header/headerButtons")).default;

    componentToTest = <HeaderButtons />;
    cleanup();
    ({ container, rerender } = render(componentToTest, {
      wrapper: AllWrapper,
    }));
  });

  it("should display a shopping cart icon, login button with registration link and a theme toggle switch", () => {
    expect(screen.getByTitle("Shopping Cart")).toBeTruthy();
    expect(screen.getByText(mockCartItems.length)).toBeTruthy();
    expect(screen.getByTestId("LoginButton")).toBeTruthy();
    expect(container.querySelector("a[href='/register']")).toBeTruthy();
    expect(screen.getByRole("switch")).toBeTruthy();
  });

  it("should open the shopping cart tab if shopping cart icon is clicked", () => {
    fireEvent.click(screen.getByTitle("Shopping Cart"));

    expect(screen.getAllByRole("img").length).toBe(mockCartItems.length);
    mockCartItems.forEach((mockCartItem) => {
      expect(screen.getByText(mockCartItem.bookData.title)).toBeTruthy();
    });
  });

  it("should display the toggle switch to change site theme", () => {
    expect(screen.getByRole("switch", { checked: false })).toBeTruthy();
    expect(screen.getByLabelText(/nap mód/i)).toBeTruthy();
  });

  it("should display the toggle switch in Dark Mode", async () => {
    useAppContext.mockReturnValue({ darkMode: true });

    rerender(componentToTest);

    expect(screen.getByRole("switch", { checked: true })).toBeTruthy();
    expect(screen.getByLabelText(/hold mód/i)).toBeTruthy();
  });
});
