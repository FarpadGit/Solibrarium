import { beforeEach, describe, expect, it } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import dynamic from "next/dynamic";
import { mockTEInput } from "@/test/utils/mockElements";
import axios from "axios";

describe("Forgot Password Page", () => {
  let container;
  const mockEmail = "user@email.com";

  beforeEach(async () => {
    dynamic.mockReturnValue(mockTEInput);

    const ForgotPassword = (await import("@/app/forgotPassword/page")).default;

    const componentToTest = <ForgotPassword />;
    cleanup();
    ({ container } = render(componentToTest));
  });

  it("should display an input field for email and a submit button", () => {
    expect(container.querySelectorAll("input").length).toBe(1);
    expect(container.querySelector("button[type='submit']")).toBeTruthy();
  });

  it("should send out an email to supplied address", async () => {
    axios.request.mockResolvedValue({ data: {} });
    const emailField = screen.getByLabelText("Email cím");
    const submitButton = container.querySelector("button[type='submit']");

    fireEvent.change(emailField, { target: { value: mockEmail } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("success-msg")).toBeTruthy();
    });
  });

  it("should display an error message if server side function failed", async () => {
    axios.request.mockResolvedValue({ data: { error: true } });
    const emailField = screen.getByLabelText("Email cím");
    const submitButton = container.querySelector("button[type='submit']");

    fireEvent.change(emailField, { target: { value: mockEmail } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("error_msg")).toBeTruthy();
    });
  });
});
