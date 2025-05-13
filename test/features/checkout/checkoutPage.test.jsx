import Checkout from "@/app/checkout/page";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { AllWrapper } from "@/test/utils/wrappers";
import { mockCartItems } from "@/test/utils/mocks";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useRouter } from "next/navigation";

describe("Checkout Page", () => {
  let container;
  const pushSpy = vi.fn();

  beforeEach(() => {
    useLocalStorage.mockReturnValue([mockCartItems, vi.fn()]);
    useRouter.mockReturnValue({ push: pushSpy });

    const componentToTest = <Checkout />;
    cleanup();
    ({ container } = render(componentToTest, {
      wrapper: AllWrapper,
    }));
  });

  it("should display checkout cards and their total price", () => {
    const totalPrice = mockCartItems.reduce(
      (total, item) => (total += item.bookData.price * item.quantity),
      0
    );

    const checkoutItems = Array.from(
      container.querySelectorAll(".checkout_item")
    );
    const trimmedHTML = container.innerHTML.replace(/\s|&nbsp;/g, "");

    expect(checkoutItems.length).toBe(mockCartItems.length);
    expect(trimmedHTML.includes(totalPrice)).toBe(true);
  });

  it("should navigate to /login page if trying to purchase while not logged in", () => {
    const buttons = screen.getAllByRole("button");
    const buyButton = buttons[buttons.length - 1];
    fireEvent.click(buyButton);

    expect(pushSpy).toHaveBeenCalledWith("/login");
  });
});
