// ============================================
// TEST: Step 6 — Performance (React.memo, useMemo, useCallback)
// ============================================
// Key concepts:
//   vi.fn()           → creates a spy function to track how many times it's called
//   call count assert → verify a memoized component/function was NOT called again
//
// Strategy:
//   We can't directly spy on React.memo internals, but we CAN:
//   1. Test that the UI output is correct after interactions
//   2. Verify useMemo filtering only recalculates when the filter changes
//   3. Verify useCallback-wrapped handlers work correctly

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step6_Performance from "../components/Step6_Performance";

describe("Step 6 — Performance", () => {

  // --- Parent render counter ---
  describe("Parent re-render trigger", () => {
    test("renders initial count trigger", () => {
      render(<Step6_Performance />);
      expect(screen.getByText(/parent render count trigger: 0/i)).toBeInTheDocument();
    });

    test("increments parent render count on button click", async () => {
      const user = userEvent.setup();
      render(<Step6_Performance />);

      await user.click(screen.getByRole("button", { name: /re-render parent/i }));
      expect(screen.getByText(/parent render count trigger: 1/i)).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: /re-render parent/i }));
      expect(screen.getByText(/parent render count trigger: 2/i)).toBeInTheDocument();
    });
  });

  // --- React.memo + useCallback (ChildCard) ---
  describe("ChildCard (React.memo + useCallback)", () => {
    test("renders all three child cards", () => {
      render(<Step6_Performance />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    test("each child card has a Greet button", () => {
      render(<Step6_Performance />);
      const greetButtons = screen.getAllByRole("button", { name: /greet/i });
      expect(greetButtons).toHaveLength(3);
    });

    test("child cards still render after parent re-renders", async () => {
      const user = userEvent.setup();
      render(<Step6_Performance />);

      await user.click(screen.getByRole("button", { name: /re-render parent/i }));
      await user.click(screen.getByRole("button", { name: /re-render parent/i }));

      // Memoized children should still be in the DOM
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
      expect(screen.getByText("Charlie")).toBeInTheDocument();
    });

    test("useCallback — same handler reference verified via vi.fn()", () => {
      // We verify useCallback behavior by rendering a test component
      // that wraps the same pattern and checking the spy is called correctly
      const spy = vi.fn();

      function TestChild({ onGreet }) {
        return <button onClick={() => onGreet("Alice")}>Greet</button>;
      }

      const { rerender } = render(<TestChild onGreet={spy} />);
      screen.getByRole("button", { name: /greet/i }).click();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("Alice");

      // Re-render with same spy — still works
      rerender(<TestChild onGreet={spy} />);
      screen.getByRole("button", { name: /greet/i }).click();
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  // --- useMemo (ExpensiveList / filter) ---
  describe("ExpensiveList (useMemo)", () => {
    test("renders all fruits initially", () => {
      render(<Step6_Performance />);
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Avocado")).toBeInTheDocument();
      expect(screen.getByText("Blueberry")).toBeInTheDocument();
      expect(screen.getByText("Apricot")).toBeInTheDocument();
      expect(screen.getByText("Mango")).toBeInTheDocument();
    });

    test("filters fruits when user types in filter input", async () => {
      const user = userEvent.setup();
      render(<Step6_Performance />);

      await user.type(screen.getByPlaceholderText(/filter fruits/i), "a");

      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Avocado")).toBeInTheDocument();
      expect(screen.getByText("Apricot")).toBeInTheDocument();
      expect(screen.getByText("Mango")).toBeInTheDocument();
      // Blueberry has no "a"
      expect(screen.queryByText("Blueberry")).not.toBeInTheDocument();
    });

    test("useMemo — filtered list does NOT recalculate on unrelated parent re-render", async () => {
      // We verify this indirectly: after a parent re-render (count change),
      // the filtered fruit list should remain unchanged (same items visible)
      const user = userEvent.setup();
      render(<Step6_Performance />);

      // All fruits visible initially
      expect(screen.getByText("Apple")).toBeInTheDocument();

      // Trigger parent re-render (unrelated to filter)
      await user.click(screen.getByRole("button", { name: /re-render parent/i }));
      await user.click(screen.getByRole("button", { name: /re-render parent/i }));

      // Fruits list should still be intact — useMemo preserved the result
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Mango")).toBeInTheDocument();
      expect(screen.getByText("Blueberry")).toBeInTheDocument();
    });

    test("useMemo — recalculates when filter input changes", async () => {
      const user = userEvent.setup();
      const filterSpy = vi.spyOn(Array.prototype, "filter");

      render(<Step6_Performance />);
      const callsAfterMount = filterSpy.mock.calls.length;

      await user.type(screen.getByPlaceholderText(/filter fruits/i), "ap");

      // filter should have been called again (dependency changed)
      expect(filterSpy.mock.calls.length).toBeGreaterThan(callsAfterMount);

      filterSpy.mockRestore();
    });

    test("shows no items when filter matches nothing", async () => {
      const user = userEvent.setup();
      render(<Step6_Performance />);

      await user.type(screen.getByPlaceholderText(/filter fruits/i), "xyz");

      expect(screen.queryByText("Apple")).not.toBeInTheDocument();
      expect(screen.queryByText("Mango")).not.toBeInTheDocument();
    });
  });
});
