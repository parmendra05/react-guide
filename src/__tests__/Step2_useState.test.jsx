// ============================================
// TEST: Step 2 — useState
// ============================================
// userEvent simulates REAL browser interactions (click, type, etc.)
// It's preferred over fireEvent because it mimics actual user behavior.
//
// Setup pattern:
//   const user = userEvent.setup()  ← creates a user session
//   await user.click(element)       ← always await userEvent actions

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step2_useState from "../components/Step2_useState";

describe("Step 2 — useState", () => {

  // --- Counter ---
  describe("Counter", () => {
    test("starts at 0 and increments on +1 click", async () => {
      const user = userEvent.setup();
      render(<Step2_useState />);

      // Initial state
      expect(screen.getByText(/counter: 0/i)).toBeInTheDocument();

      // Simulate a click
      await user.click(screen.getByRole("button", { name: /\+1/i }));

      // State updated → re-render → new text visible
      expect(screen.getByText(/counter: 1/i)).toBeInTheDocument();
    });

    test("decrements on -1 click", async () => {
      const user = userEvent.setup();
      render(<Step2_useState />);

      await user.click(screen.getByRole("button", { name: /-1/i }));
      expect(screen.getByText(/counter: -1/i)).toBeInTheDocument();
    });

    test("resets to 0", async () => {
      const user = userEvent.setup();
      render(<Step2_useState />);

      await user.click(screen.getByRole("button", { name: /\+1/i }));
      await user.click(screen.getByRole("button", { name: /\+1/i }));
      await user.click(screen.getByRole("button", { name: /reset/i }));

      expect(screen.getByText(/counter: 0/i)).toBeInTheDocument();
    });
  });

  // --- Toggle ---
  describe("Toggle", () => {
    test("hides message when Hide is clicked", async () => {
      const user = userEvent.setup();
      render(<Step2_useState />);

      // Message is visible initially
      expect(screen.getByText(/👋 hello/i)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /hide message/i }));

      // queryByText returns null (not throw) when element is absent — use for "not present" checks
      expect(screen.queryByText(/👋 hello/i)).not.toBeInTheDocument();
    });

    test("shows message again after Show is clicked", async () => {
      const user = userEvent.setup();
      render(<Step2_useState />);

      await user.click(screen.getByRole("button", { name: /hide message/i }));
      await user.click(screen.getByRole("button", { name: /show message/i }));

      expect(screen.getByText(/👋 hello/i)).toBeInTheDocument();
    });
  });

  // --- Object State (UserForm) ---
  describe("UserForm", () => {
    test("updates name field on typing", async () => {
      const user = userEvent.setup();
      render(<Step2_useState />);

      const nameInput = screen.getByPlaceholderText("Name");
      await user.type(nameInput, "Ali");

      // The live preview paragraph should reflect the typed value
      expect(screen.getByText(/name: ali/i)).toBeInTheDocument();
    });

    test("updates both name and email fields", async () => {
      const user = userEvent.setup();
      render(<Step2_useState />);

      await user.type(screen.getByPlaceholderText("Name"), "Ali");
      await user.type(screen.getByPlaceholderText("Email"), "ali@test.com");

      expect(screen.getByText(/name: ali \| email: ali@test\.com/i)).toBeInTheDocument();
    });
  });
});
