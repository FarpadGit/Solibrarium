import UserBooks from "@/components/account/UserBooks";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { generateMockBook } from "@/test/utils/mocks";
import { useSession } from "next-auth/react";
import axios from "axios";

describe("User Books", () => {
  let container;
  const setSelectedSpy = vi.fn();
  const mockUserBooks = Array.from({ length: 6 }, () => generateMockBook());
  let userBookElements;

  beforeEach(async () => {
    axios.request.mockResolvedValue({ data: mockUserBooks });
    useSession.mockReturnValue({
      data: { user: { id: "FakeUserID" } },
    });

    const componentToTest = (
      <UserBooks
        selected={mockUserBooks[0]}
        setSelected={setSelectedSpy}
        ref={undefined}
      />
    );
    cleanup();
    ({ container } = render(componentToTest, { wrapper: AllWrapper }));
    userBookElements = await screen.findAllByRole("radio");
  });

  it("should display purchased books within bookshelf", () => {
    expect(screen.getByTestId("bookshelf")).toBeTruthy();
    expect(userBookElements.length).toBe(mockUserBooks.length);
    mockUserBooks.forEach((mockUserBook) => {
      expect(
        container.querySelector(
          `img[src*="${encodeURIComponent(mockUserBook.image)}"]`
        )
      ).toBeTruthy();
    });
  });

  it("should select another user book if clicked", () => {
    fireEvent.click(userBookElements[1]);

    expect(setSelectedSpy).toHaveBeenCalledWith(mockUserBooks[1]);
  });

  it("should select another user book if Enter key is pressed while in focus", () => {
    const bookLabel = container.querySelector(
      `[for="${userBookElements[2].value}"]`
    );

    fireEvent.keyDown(bookLabel, { code: "Enter" });

    expect(setSelectedSpy).toHaveBeenCalledWith(mockUserBooks[2]);
  });
});
