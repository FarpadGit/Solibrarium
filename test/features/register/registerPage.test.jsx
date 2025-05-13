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

describe("Register Page", () => {
  let container;
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

    const Register = (await import("@/app/register/page")).default;

    const componentToTest = <Register />;
    cleanup();
    ({ container } = render(componentToTest));
  });

  it("should display an input field for email, password and password confirmation, and a submit button", () => {
    expect(container.querySelectorAll("input").length).toBe(3);
    expect(screen.getByLabelText("Email cím")).toBeTruthy();
    expect(screen.getByLabelText("Jelszó")).toBeTruthy();
    expect(screen.getByLabelText("Jelszó ismét")).toBeTruthy();
    expect(container.querySelector("button[type='submit']")).toBeTruthy();
  });

  it("should register a new user with valid inputs", async () => {
    axios.request.mockResolvedValue({ data: {} });
    const emailField = screen.getByLabelText("Email cím");
    const passwordField = screen.getByLabelText("Jelszó");
    const confirmField = screen.getByLabelText("Jelszó ismét");
    const submitButton = container.querySelector("button[type='submit']");

    fireEvent.change(emailField, { target: { value: mockEmail } });
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
    axios.request.mockResolvedValue({ data: { error: true } });
    const emailField = screen.getByLabelText("Email cím");
    const passwordField = screen.getByLabelText("Jelszó");
    const confirmField = screen.getByLabelText("Jelszó ismét");
    const submitButton = container.querySelector("button[type='submit']");

    fireEvent.change(emailField, { target: { value: mockEmail } });
    fireEvent.change(passwordField, { target: { value: mockPassword } });
    fireEvent.change(confirmField, { target: { value: mockPassword } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("error_msg")).toBeTruthy();
      expect(loginUserSpy).not.toHaveBeenCalled();
    });
  });
});
