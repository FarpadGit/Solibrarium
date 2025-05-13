import { ShoppingCart } from "@/components/shoppingcart/ShoppingCart";
import { AllWrapper } from "@/test/utils/wrappers";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { matchByText } from "@/test/utils/commands";
import { mockCartItems } from "@/test/utils/mocks";
import { useRouter } from "next/navigation";

describe("Shopping Cart", () => {
  let container;
  const sheetPath = vi.hoisted(() => "@/components/ui/Sheet");

  function renderComponent() {
    const componentToTest = <ShoppingCart />;
    cleanup();
    ({ container } = render(componentToTest, { wrapper: AllWrapper }));
  }

  beforeAll(() => {
    // test component is outside Shadcn Sheet component (and it should be) so we're mocking out the SheetClose buttons inside it with a div
    vi.mock(sheetPath, async () => {
      const actual = await vi.importActual(sheetPath);
      return {
        ...actual,
        SheetClose: ({ children }) => <div>{children}</div>,
      };
    });
  });

  it("should display shopping cart items and total price", () => {
    useLocalStorage.mockReturnValue([mockCartItems, vi.fn()]);
    const totalPrice = mockCartItems.reduce(
      (total, item) => (total += item.bookData.price * item.quantity),
      0
    );

    renderComponent();
    const cartItems = Array.from(container.querySelectorAll(".cart_item"));
    const trimmedHTML = container.innerHTML.replace(/\s|&nbsp;/g, "");

    expect(cartItems.length).toBe(mockCartItems.length);
    expect(trimmedHTML.includes(totalPrice)).toBe(true);
  });

  it("should navigate to checkout page if Next button is pressed", async () => {
    useLocalStorage.mockReturnValue([mockCartItems, vi.fn()]);
    const pushSpy = vi.fn();
    useRouter.mockReturnValueOnce({ push: pushSpy });

    renderComponent();
    const buttons = screen.getAllByRole("button");
    const nextButton = buttons[buttons.length - 1];
    fireEvent.click(nextButton);

    expect(pushSpy).toHaveBeenCalledWith("/checkout");
  });

  it("should display a message if shopping cart is empty", () => {
    useLocalStorage.mockReturnValue([[], vi.fn()]);

    renderComponent();
    const cartItems = Array.from(container.querySelectorAll(".cart_item"));

    expect(cartItems.length).toBe(0);
    expect(matchByText("üres")).toBeTruthy();
  });

  afterAll(() => {
    vi.doUnmock(sheetPath);
  });
});
