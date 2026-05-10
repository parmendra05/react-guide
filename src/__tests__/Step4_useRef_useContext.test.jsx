// ============================================
// TEST: Step 4 — useRef & useContext
// ============================================
// Key concepts:
//   useRef DOM test  → check focus behavior via document.activeElement
//   useContext test  → wrap component in a real Context.Provider to inject values
//   getByDisplayValue → query an input by its current value

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step4_useRef_useContext from "../components/Step4_useRef_useContext";

describe("Step 4 — useRef & useContext", () => {

  // --- FocusInput (useRef DOM access) ---
  describe("FocusInput", () => {
    test("renders the input and focus button", () => {
      render(<Step4_useRef_useContext />);
      expect(screen.getByPlaceholderText(/click button to focus me/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /focus input/i })).toBeInTheDocument();
    });

    test("focuses the input when Focus Input button is clicked", async () => {
      const user = userEvent.setup();
      render(<Step4_useRef_useContext />);

      const input = screen.getByPlaceholderText(/click button to focus me/i);
      const button = screen.getByRole("button", { name: /focus input/i });

      await user.click(button);

      // document.activeElement tells us which element currently has focus
      expect(document.activeElement).toBe(input);
    });
  });

  // --- RenderCounter (useRef value tracking) ---
  describe("RenderCounter", () => {
    test("shows initial state count of 0", () => {
      render(<Step4_useRef_useContext />);
      expect(screen.getByText(/state count: 0/i)).toBeInTheDocument();
    });

    test("increments state count on button click", async () => {
      const user = userEvent.setup();
      render(<Step4_useRef_useContext />);

      await user.click(screen.getByRole("button", { name: /increment state/i }));
      expect(screen.getByText(/state count: 1/i)).toBeInTheDocument();
    });

    test("tracks render count via ref", async () => {
      const user = userEvent.setup();
      render(<Step4_useRef_useContext />);

      // After mount: 1 render. After click: 2 renders.
      await user.click(screen.getByRole("button", { name: /increment state/i }));
      expect(screen.getByText(/rendered: \d+ times/i)).toBeInTheDocument();
    });
  });

  // --- ThemeApp (useContext) ---
  // The ThemeContext.Provider is INSIDE ThemeApp, so we just render the
  // full Step4 component — no custom wrapper needed here.
  describe("ThemeApp (useContext)", () => {
    test("shows light theme by default", () => {
      render(<Step4_useRef_useContext />);
      expect(screen.getByText(/current theme: light/i)).toBeInTheDocument();
    });

    test("themed button shows correct label in light mode", () => {
      render(<Step4_useRef_useContext />);
      expect(screen.getByRole("button", { name: /i am a light button/i })).toBeInTheDocument();
    });

    test("toggles to dark theme on button click", async () => {
      const user = userEvent.setup();
      render(<Step4_useRef_useContext />);

      await user.click(screen.getByRole("button", { name: /toggle theme/i }));

      expect(screen.getByText(/current theme: dark/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /i am a dark button/i })).toBeInTheDocument();
    });

    test("toggles back to light theme on second click", async () => {
      const user = userEvent.setup();
      render(<Step4_useRef_useContext />);

      await user.click(screen.getByRole("button", { name: /toggle theme/i }));
      await user.click(screen.getByRole("button", { name: /toggle theme/i }));

      expect(screen.getByText(/current theme: light/i)).toBeInTheDocument();
    });
  });
});
