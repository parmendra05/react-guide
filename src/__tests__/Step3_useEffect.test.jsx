// ============================================
// TEST: Step 3 — useEffect
// ============================================
// Key concepts:
//   findBy*     → async query, waits for element to appear (returns Promise)
//   vi.fn()     → creates a mock function you can spy on
//   vi.spyOn()  → replaces a method on an object with a spy
//   afterEach   → cleanup after each test
//
// Why mock fetch?
//   Tests must NOT make real network requests — they'd be slow, flaky,
//   and dependent on an external server. We replace fetch with a fake.

import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step3_useEffect from "../components/Step3_useEffect";

describe("Step 3 — useEffect", () => {

  // --- UserFetcher (async fetch on mount) ---
  describe("UserFetcher", () => {
    afterEach(() => {
      vi.restoreAllMocks(); // restore original fetch after each test
    });

    test("shows Loading... initially then displays fetched user", async () => {
      // vi.spyOn replaces global.fetch with our fake implementation
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        json: async () => ({ name: "Leanne Graham", email: "leanne@april.biz" }),
      });

      render(<Step3_useEffect />);

      // Loading state is shown immediately (synchronous)
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // findByText waits (polls) until the element appears after the async fetch
      const user = await screen.findByText(/leanne graham/i);
      expect(user).toBeInTheDocument();
      expect(screen.getByText(/leanne@april\.biz/i)).toBeInTheDocument();
    });

    test("fetch is called with the correct URL", async () => {
      const mockFetch = vi.spyOn(global, "fetch").mockResolvedValueOnce({
        json: async () => ({ name: "Test User", email: "test@test.com" }),
      });

      render(<Step3_useEffect />);
      await screen.findByText(/test user/i);

      expect(mockFetch).toHaveBeenCalledWith(
        "https://jsonplaceholder.typicode.com/users/1"
      );
    });
  });

  // --- SearchFilter (useEffect on dependency change) ---
  describe("SearchFilter", () => {
    test("shows all fruits on initial render", () => {
      render(<Step3_useEffect />);
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Banana")).toBeInTheDocument();
      expect(screen.getByText("Avocado")).toBeInTheDocument();
    });

    test("filters results when user types in search box", async () => {
      const user = userEvent.setup();
      render(<Step3_useEffect />);

      await user.type(screen.getByPlaceholderText(/search fruit/i), "ap");

      // Only fruits containing "ap" should remain
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Apricot")).toBeInTheDocument();
      expect(screen.queryByText("Banana")).not.toBeInTheDocument();
      expect(screen.queryByText("Blueberry")).not.toBeInTheDocument();
    });

    test("shows no results for a non-matching query", async () => {
      const user = userEvent.setup();
      render(<Step3_useEffect />);

      await user.type(screen.getByPlaceholderText(/search fruit/i), "xyz");

      expect(screen.queryByText("Apple")).not.toBeInTheDocument();
      expect(screen.queryByText("Banana")).not.toBeInTheDocument();
    });
  });

  // --- Timer (useEffect with cleanup) ---
  describe("Timer", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    test("shows Timer: 0s initially", () => {
      render(<Step3_useEffect />);
      expect(screen.getByText(/timer: 0s/i)).toBeInTheDocument();
    });

    test("increments timer after Start is clicked", () => {
      render(<Step3_useEffect />);

      fireEvent.click(screen.getByRole("button", { name: /start/i }));
      act(() => vi.advanceTimersByTime(3000));

      expect(screen.getByText(/timer: 3s/i)).toBeInTheDocument();
    });

    test("stops incrementing after Stop is clicked", () => {
      render(<Step3_useEffect />);

      fireEvent.click(screen.getByRole("button", { name: /start/i }));
      act(() => vi.advanceTimersByTime(2000));
      fireEvent.click(screen.getByRole("button", { name: /stop/i }));
      act(() => vi.advanceTimersByTime(3000));

      expect(screen.getByText(/timer: 2s/i)).toBeInTheDocument();
    });

    test("resets timer to 0s", () => {
      render(<Step3_useEffect />);

      fireEvent.click(screen.getByRole("button", { name: /start/i }));
      act(() => vi.advanceTimersByTime(5000));
      fireEvent.click(screen.getByRole("button", { name: /reset/i }));

      expect(screen.getByText(/timer: 0s/i)).toBeInTheDocument();
    });
  });
});
