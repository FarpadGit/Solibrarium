import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ReduxWrapper } from "@/test/utils/wrappers";
import UserMenu from "@/components/popovers/UserMenu";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { useAppContext } from "@/contexts/AppContext";

describe("Login Button", () => {
  let LoginButton;
  let container;
  let getRememberMeSpy = vi.fn();
  let deleteRememberMeSpy = vi.fn();
  let logOutUserSpy = vi.fn();

  beforeEach(async () => {
    useAppContext.mockReturnValue({
      isLoggingIn: false,
      getRememberMe: getRememberMeSpy,
      deleteRememberMe: deleteRememberMeSpy,
      logOutUser: logOutUserSpy,
    });
    dynamic.mockReturnValue(UserMenu);
    LoginButton = (await import("@/components/header/LoginButton")).default;
  });

  function renderComponent() {
    const componentToTest = <LoginButton />;
    cleanup();
    ({ container } = render(componentToTest, {
      wrapper: ReduxWrapper,
    }));
  }

  describe("User not logged in", () => {
    it("should display a login button with registration link", () => {
      renderComponent();

      expect(screen.getByTestId("LoginButton")).toBeTruthy();
      expect(container.querySelector("a[href='/register']")).toBeTruthy();
    });
  });

  describe("User logged in", () => {
    beforeEach(() => {
      useSession.mockReturnValue({
        data: { user: true, rememberMe: null },
      });
    });

    it("should display a button with welcome text if user is logged in", () => {
      renderComponent();

      expect(screen.getByTestId("WelcomeButton")).toBeTruthy();
    });

    it("should display a user menu if welcome button is hovered over", () => {
      renderComponent();

      fireEvent.mouseOver(screen.getByTestId("WelcomeButton"));
      const menuItems = screen.getAllByTestId("MenuItem");

      expect(menuItems.length).toBe(3);
    });

    it("should log out user if last user menu item is selected", () => {
      renderComponent();

      fireEvent.mouseOver(screen.getByTestId("WelcomeButton"));

      const menuItems = screen.getAllByTestId("MenuItem");
      fireEvent.click(menuItems[menuItems.length - 1]);

      expect(logOutUserSpy).toHaveBeenCalled();
    });

    it("should display a user menu with option to delete user's Remember Me token if present", () => {
      getRememberMeSpy.mockReturnValue({ key: "FakeKey" });
      renderComponent();

      fireEvent.mouseOver(screen.getByTestId("WelcomeButton"));
      const menuItems = screen.getAllByTestId("MenuItem");

      expect(menuItems.length).toBe(4);

      fireEvent.click(screen.getByText(/felejts el/i));

      expect(deleteRememberMeSpy).toHaveBeenCalled();
    });
  });
});
