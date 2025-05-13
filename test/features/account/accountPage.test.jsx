import Account from "@/app/account/page";
import { describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { useSession } from "next-auth/react";
import { matchByText } from "@/test/utils/commands";
import { generateMockBook } from "@/test/utils/mocks";
import axios from "axios";

describe("Account Page", () => {
  let container;
  const mockUserID = "FakeUserID";
  const mockUserBooks = Array.from({ length: 6 }, () => generateMockBook());

  function renderComponent() {
    axios.request.mockResolvedValue({ data: mockUserBooks });

    const componentToTest = <Account />;
    cleanup();
    ({ container } = render(componentToTest));
  }

  it("should display a page for non-authenticated users", () => {
    renderComponent();

    expect(screen.queryByRole("heading", { level: 1 })).toBeFalsy();
    expect(screen.getByTestId("loggedOutText")).toBeTruthy();
  });

  it("should display a page for authenticated users with a bookshelf, loyalty points and container element for book reviews", () => {
    const mockLoyaltyPoints = 120;
    useSession.mockReturnValue({
      data: { user: { id: mockUserID, loyaltyPoints: mockLoyaltyPoints } },
      status: "authenticated",
    });

    renderComponent();

    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.queryByTestId("loggedOutText")).toBeFalsy();
    expect(screen.getAllByTestId("bookshelf").length).toBeGreaterThan(0);
    expect(matchByText(mockLoyaltyPoints + " pont")).toBeTruthy();
    expect(container.querySelector(".bookreview_container")).toBeTruthy();
  });

  it("should display purchased books within bookshelf", async () => {
    useSession.mockReturnValue({
      data: { user: { id: mockUserID, loyaltyPoints: 0 } },
      status: "authenticated",
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByRole("radio").length).toBe(mockUserBooks.length);
    });
  });

  it("should display book review card if a user book is selected", async () => {
    useSession.mockReturnValue({
      data: { user: { id: mockUserID, loyaltyPoints: 0 } },
      status: "authenticated",
    });

    renderComponent();

    // this will also await the axios fetch in the useEffect in UserBooks component
    // before that it will be in loading state
    const userBooks = await screen.findAllByRole("radio");

    axios.request.mockResolvedValueOnce({
      data: { reviewText: "Fake Review", rating: 5 },
    });

    fireEvent.click(userBooks[0]);

    await waitFor(() => {
      expect(screen.getByText(mockUserBooks[0].title)).toBeTruthy();
      expect(screen.getByRole("button", { name: /mentés/i })).toBeTruthy();
    });
  });
});
