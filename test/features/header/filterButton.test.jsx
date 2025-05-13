import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReduxWrapper } from "@/test/utils/wrappers";
import FiltersModal from "@/components/popovers/FiltersModal";
import dynamic from "next/dynamic";

describe("Filter Button", () => {
  beforeEach(async () => {
    dynamic.mockReturnValue(FiltersModal);
    const FilterButton = (await import("@/components/header/FilterButton"))
      .default;
    const componentToTest = <FilterButton />;
    cleanup();
    render(componentToTest, {
      wrapper: ReduxWrapper,
    });
  });

  it("should display a filter button", () => {
    expect(screen.getByAltText("search filters")).toBeTruthy();
  });

  it("should display a popup with filter options when button is pressed", () => {
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
    expect(screen.getByAltText(/filter by/)).toBeTruthy();
  });

  it("should toggle filter option when clicked", () => {
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getAllByRole("checkbox")[0]);

    expect(screen.getAllByRole("checkbox")[0].checked).toBe(true);
  });
});
