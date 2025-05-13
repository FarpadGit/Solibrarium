import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
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

describe("Reset Password Page", () => {
  let container;

  async function renderComponent() {
    const ResetPassword = (
      await import("@/app/resetPassword/[token]/[key]/page")
    ).default;

    const componentToTest = (
      <ResetPassword
        params={Promise.resolve({ token: "FakeToken", key: "FakeKey" })}
      />
    );
    cleanup();
    await act(async () => {
      ({ container } = render(componentToTest));
    });
  }

  describe("Valid Email", () => {
    const loginUserSpy = vi.fn();
    const pushSpy = vi.fn();
    const mockEmail = "user@email.com";
    const mockPassword = "Pass123";

    beforeEach(async () => {
      loginUserSpy.mockClear();
      pushSpy.mockClear();

      useAppContext.mockReturnValue({ loginUser: loginUserSpy });
      useRouter.mockReturnValue({ push: pushSpy });
      dynamic.mockReturnValue(mockTEInput);
      axios.request.mockResolvedValue({ data: mockEmail });

      await renderComponent();
    });

    it("should display an input field for pre-populated email, password and password confirmation, and a submit button", () => {
      expect(container.querySelectorAll("input").length).toBe(3);
      expect(screen.getByLabelText("Email cím")).toBeTruthy();
      expect(screen.getByLabelText("Email cím").value).toBe(mockEmail);
      expect(screen.getByLabelText("Jelszó")).toBeTruthy();
      expect(screen.getByLabelText("Jelszó ismét")).toBeTruthy();
      expect(container.querySelector("button[type='submit']")).toBeTruthy();
    });

    it("should re-register a user with valid password input", async () => {
      axios.request.mockResolvedValueOnce({ data: {} });
      const passwordField = screen.getByLabelText("Jelszó");
      const confirmField = screen.getByLabelText("Jelszó ismét");
      const submitButton = container.querySelector("button[type='submit']");

      fireEvent.change(passwordField, { target: { value: mockPassword } });
      fireEvent.change(confirmField, { target: { value: mockPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(loginUserSpy).toHaveBeenCalledWith(
          expect.objectContaining({ email: mockEmail, password: mockPassword })
        );
        expect(pushSpy).toHaveBeenCalledWith("/");
      });
    });

    it("should display an error message if registration failed", async () => {
      axios.request.mockResolvedValueOnce({ data: { error: true } });
      const passwordField = screen.getByLabelText("Jelszó");
      const confirmField = screen.getByLabelText("Jelszó ismét");
      const submitButton = container.querySelector("button[type='submit']");

      fireEvent.change(passwordField, { target: { value: mockPassword } });
      fireEvent.change(confirmField, { target: { value: mockPassword } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByTestId("error_msg")).toBeTruthy();
        expect(loginUserSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("Invalid Email", () => {
    beforeEach(async () => {
      axios.request.mockResolvedValue({ data: { error: true } });
      await renderComponent();
    });

    it("should display an error message if email validation fails", () => {
      expect(container.querySelectorAll("input").length).toBe(0);
      expect(screen.getByTestId("reset-error-msg")).toBeTruthy();
    });
  });
});
