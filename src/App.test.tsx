import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Focus Claw demo", () => {
  it("renders the Focus home and sample priority items", () => {
    render(<App />);
    expect(screen.getByText(/Make room for/i)).toBeInTheDocument();
    expect(screen.getByText("Mum")).toBeInTheDocument();
    expect(screen.getByText("Bank alert")).toBeInTheDocument();
  });

  it("navigates to consent and exposes opt-in controls", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Consent" }));
    expect(screen.getByText("Your consent, your call.")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "WhatsApp notifications" })).toHaveAttribute("aria-checked", "false");
  });

  it("can clear a sample focus item", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Clear Mum" }));
    expect(screen.queryByText("Mum")).not.toBeInTheDocument();
  });

  it("can add a local demo blocked number", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Call Block" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Number to block" }), { target: { value: "+91 90000 00000" } });
    fireEvent.click(screen.getByRole("button", { name: /Add number/i }));
    expect(screen.getByText("+91 90000 00000")).toBeInTheDocument();
  });
});
