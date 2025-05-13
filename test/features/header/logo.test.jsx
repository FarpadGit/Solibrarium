import { describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { useAppContext } from "@/contexts/AppContext";

describe("Logo", () => {
  let container;

  async function renderComponent() {
    const Logo = (await import("@/components/header/Logo")).default;
    const componentToTest = <Logo />;
    cleanup();
    ({ container } = render(componentToTest, {
      wrapper: AllWrapper,
    }));
  }

  it("should display the logo and text", async () => {
    await renderComponent();

    expect(screen.getByAltText("logo")).toBeTruthy();
    expect(screen.getByText("Solibrarium")).toBeTruthy();
  });

  it("should display the Dark Mode logo", async () => {
    useAppContext.mockReturnValue({ darkMode: true });

    await renderComponent();

    expect(
      container.querySelector("img[src*='solibrarium_logo_night.png']")
    ).toBeTruthy();
  });
});
