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
import { mockTEInput } from "@/test/utils/mockElements";
import axios from "axios";

describe("Login Page", () => {
  let container;
  const loginUserSpy = vi.fn();
  const loginUserWithGoogleSpy = vi.fn();
  const replaceSpy = vi.fn();

  beforeEach(async () => {
    replaceSpy.mockClear();

    useAppContext.mockReturnValue({
      loginUser: loginUserSpy,
      loginUserWithGoogle: loginUserWithGoogleSpy,
      isLoggingIn: false,
    });
    useRouter.mockReturnValue({ replace: replaceSpy });
    dynamic.mockReturnValue(mockTEInput);

    const Login = (await import("@/app/login/page")).default;

    const componentToTest = <Login />;
    cleanup();
    ({ container } = render(componentToTest));
  });

  it("should display an input field for email, password, Remember Me checkbox, links to Forgot Password and Register pages and a submit button", () => {
    expect(container.querySelectorAll("input").length).toBe(2 + 1);
    expect(screen.getByRole("checkbox")).toBeTruthy();
    expect(screen.getByLabelText("Email cím")).toBeTruthy();
    expect(screen.getByLabelText("Jelszó")).toBeTruthy();
    expect(screen.getByLabelText("Jegyezz meg")).toBeTruthy();
    expect(container.querySelector("a[href='/forgotPassword']")).toBeTruthy();
    expect(container.querySelector("a[href='/register']")).toBeTruthy();
    expect(container.querySelector("button[type='submit']")).toBeTruthy();
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
        expect(replaceSpy).toHaveBeenCalledWith("/");
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

    it("should set a key in Local Storage if Remember Me option was ticked on submit", async () => {
      const rememberMeToken = "FakeRememberMeToken";
      vi.stubGlobal("localStorage", {
        getItem: vi.fn(),
        setItem: vi.fn(),
      });
      axios.request.mockResolvedValue({ data: rememberMeToken });
      loginUserSpy.mockResolvedValue({});
      const emailField = screen.getByLabelText("Email cím");
      const passwordField = screen.getByLabelText("Jelszó");
      const rememberMeField = screen.getByLabelText("Jegyezz meg");
      const submitButton = container.querySelector("button[type='submit']");

      fireEvent.change(emailField, { target: { value: mockEmail } });
      fireEvent.change(passwordField, { target: { value: mockPassword } });
      fireEvent.click(rememberMeField);
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          "RememberMe",
          JSON.stringify(rememberMeToken)
        );
        vi.unstubAllGlobals();
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
        expect(replaceSpy).toHaveBeenCalledWith("/");
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
