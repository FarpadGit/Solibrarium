import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { mockDiv, mockTEInput } from "@/test/utils/mockElements";

describe("Minified Login Page", () => {
  let container;
  const loginUserSpy = vi.fn();
  const loginUserWithGoogleSpy = vi.fn();

  beforeEach(async () => {
    useAppContext.mockReturnValue({
      loginUser: loginUserSpy,
      loginUserWithGoogle: loginUserWithGoogleSpy,
      isLoggingIn: false,
    });
    useRouter.mockReturnValue({ back: vi.fn() });
    // the order is important - the first call to dynamic() is for the inner component's TEInput, the rest is for TEModal related
    dynamic.mockReturnValueOnce(mockTEInput);
    dynamic.mockReturnValue(mockDiv);

    const Login = (await import("@/app/checkout/@modal/(..)login/page"))
      .default;

    const componentToTest = <Login />;
    cleanup();
    ({ container } = render(componentToTest));
  });

  it("should display an input field for email, password and a submit button, but no Remember Me checkbox or links", () => {
    expect(container.querySelectorAll("input").length).toBe(2);
    expect(screen.getByLabelText("Email cím")).toBeTruthy();
    expect(screen.getByLabelText("Jelszó")).toBeTruthy();
    expect(container.querySelector("button[type='submit']")).toBeTruthy();

    expect(screen.queryByRole("checkbox")).toBeFalsy();
    expect(container.querySelector("a")).toBeFalsy();
  });

  describe("Login with credentials", () => {
    const mockEmail = "user@email.com";
    const mockPassword = "Pass123";

    beforeEach(() => {
      loginUserSpy.mockClear();
    });

    it("should log in a user with valid inputs", async () => {
      loginUserSpy.mockResolvedValue({});
      const emailField = screen.getByLabelText("Email cím");
      const passwordField = screen.getByLabelText("Jelszó");
      const submitButton = container.querySelector("button[type='submit']");

      fireEvent.change(emailField, { target: { value: mockEmail } });
      fireEvent.change(passwordField, { target: { value: mockPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(loginUserSpy).toHaveBeenCalledWith(
          expect.objectContaining({ email: mockEmail, password: mockPassword })
        );
      });
    });

    it("should display an error message if login failed", async () => {
      loginUserSpy.mockResolvedValue({ error: true });
      const emailField = screen.getByLabelText("Email cím");
      const passwordField = screen.getByLabelText("Jelszó");
      const submitButton = container.querySelector("button[type='submit']");

      fireEvent.change(emailField, { target: { value: mockEmail } });
      fireEvent.change(passwordField, { target: { value: mockPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("error_msg")).toBeTruthy();
        expect(loginUserSpy).toHaveBeenCalled();
      });
    });
  });

  describe("Login with Google", () => {
    beforeEach(() => {
      loginUserWithGoogleSpy.mockClear();
    });

    it("should log in a user with successful authentication", async () => {
      loginUserWithGoogleSpy.mockResolvedValue({});
      const googleButton = screen.getByRole("button", { name: /Google/ });

      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(loginUserWithGoogleSpy).toHaveBeenCalled();
      });
    });

    it("should display an error message if login failed", async () => {
      loginUserWithGoogleSpy.mockResolvedValue({ error: true });
      const googleButton = screen.getByRole("button", { name: /Google/ });

      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(screen.getByTestId("error_msg")).toBeTruthy();
        expect(loginUserWithGoogleSpy).toHaveBeenCalled();
      });
    });
  });
});
