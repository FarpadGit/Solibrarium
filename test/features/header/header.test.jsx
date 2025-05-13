import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AllWrapper } from "@/test/utils/wrappers";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { mockDiv } from "@/test/utils/mockElements";

describe("Header", () => {
  let container;

  beforeEach(async () => {
    dynamic.mockReturnValue(mockDiv);
    usePathname.mockReturnValue(vi.fn());

    const Header = (await import("@/components/header/Header")).default;

    const componentToTest = <Header />;
    cleanup();
    ({ container } = render(componentToTest, {
      wrapper: AllWrapper,
    }));
  });

  it("should display the site logo, 1 search bar with filters and settings buttons, shopping cart icon, a login button, register link and theme switch", () => {
    expect(screen.getByAltText("logo")).toBeTruthy();
    expect(screen.getByText("Solibrarium")).toBeTruthy();
    expect(screen.getByAltText("search filters")).toBeTruthy();
    expect(screen.getAllByRole("textbox").length).toBe(1);
    expect(container.querySelectorAll("button.settings_btn").length).toBe(1);
    expect(container.querySelector("button.add_btn")).toBeTruthy();
    expect(container.querySelector("#Cart-btn")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Belépés" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Regisztrálok" })).toBeTruthy();
    expect(screen.getByRole("switch", { name: "Nap mód" })).toBeTruthy();
  });
});
