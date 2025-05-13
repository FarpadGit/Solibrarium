import QuickLinks from "@/components/home/QuickLinks";
import { beforeEach, describe, expect, it } from "vitest";
import { cleanup, render, within } from "@testing-library/react";
import { ReduxWrapper } from "@/test/utils/wrappers";

describe("Quick Links", () => {
  let container;

  beforeEach(() => {
    const componentToTest = <QuickLinks />;
    cleanup();
    ({ container } = render(componentToTest, { wrapper: ReduxWrapper }));
  });

  it("should display 8 quick links for book categories", async () => {
    const quickLinksElement = container.querySelector("#QuickLinks");
    const links = within(quickLinksElement).getAllByRole("link");

    expect(quickLinksElement).toBeTruthy();
    expect(links.length).toBe(8);
    expect(
      within(quickLinksElement).getByText("Hangoskönyvek", { selector: "a" })
    ).toBeTruthy();
    expect(
      within(quickLinksElement).getByText("Gyerekek", { selector: "a" })
    ).toBeTruthy();
    expect(
      within(quickLinksElement).getByText("Fiatal Felnőtt", { selector: "a" })
    ).toBeTruthy();
    expect(
      within(quickLinksElement).getByText("Fantasy", { selector: "a" })
    ).toBeTruthy();
    expect(
      within(quickLinksElement).getByText("Történelem", { selector: "a" })
    ).toBeTruthy();
    expect(
      within(quickLinksElement).getByText("Képregények", { selector: "a" })
    ).toBeTruthy();
    expect(
      within(quickLinksElement).getByText("Romantika", { selector: "a" })
    ).toBeTruthy();
    expect(
      within(quickLinksElement).getByText("Horror", { selector: "a" })
    ).toBeTruthy();
  });
});
