// ============================================
// TEST: Step 5 — useReducer & Custom Hooks
// ============================================
// Key concepts:
//   useReducer UI test → dispatch actions via user clicks, assert DOM output
//   renderHook        → test a custom hook in isolation (no UI component needed)
//   act()             → wrap state updates that happen outside React events
//
// renderHook lets you call a hook directly and inspect its return value,
// without needing to build a component around it.

import { render, screen } from "@testing-library/react";
import { renderHook, act } from "@testing-library/react";
import { useReducer } from "react";
import userEvent from "@testing-library/user-event";
import Step5_useReducer_CustomHooks from "../components/Step5_useReducer_CustomHooks";

// Import the hooks directly for isolated hook testing
// We test them by copy-referencing the same logic used in the component.
// Since hooks are not exported, we re-define minimal versions here to
// demonstrate renderHook — the real value is in the UI integration tests below.

describe("Step 5 — useReducer & Custom Hooks", () => {

  // --- ShoppingCart (useReducer) ---
  describe("ShoppingCart", () => {
    test("renders all products", () => {
      render(<Step5_useReducer_CustomHooks />);
      expect(screen.getByText(/apple/i)).toBeInTheDocument();
      expect(screen.getByText(/banana/i)).toBeInTheDocument();
      expect(screen.getByText(/mango/i)).toBeInTheDocument();
    });

    test("cart starts empty with total $0.00", () => {
      render(<Step5_useReducer_CustomHooks />);
      expect(screen.getByText(/cart \(0 items\)/i)).toBeInTheDocument();
      expect(screen.getByText(/total: \$0\.00/i)).toBeInTheDocument();
    });

    test("ADD action — adds item to cart", async () => {
      const user = userEvent.setup();
      render(<Step5_useReducer_CustomHooks />);

      const addButtons = screen.getAllByRole("button", { name: /add to cart/i });
      await user.click(addButtons[0]); // Add Apple

      expect(screen.getByText(/cart \(1 items\)/i)).toBeInTheDocument();
      expect(screen.getByText(/apple × 1/i)).toBeInTheDocument();
    });

    test("ADD action — increments quantity when same item added twice", async () => {
      const user = userEvent.setup();
      render(<Step5_useReducer_CustomHooks />);

      const addButtons = screen.getAllByRole("button", { name: /add to cart/i });
      await user.click(addButtons[0]); // Apple
      await user.click(addButtons[0]); // Apple again

      // Still 1 unique item, but qty = 2
      expect(screen.getByText(/cart \(1 items\)/i)).toBeInTheDocument();
      expect(screen.getByText(/apple × 2/i)).toBeInTheDocument();
    });

    test("REMOVE action — removes item from cart", async () => {
      const user = userEvent.setup();
      render(<Step5_useReducer_CustomHooks />);

      const addButtons = screen.getAllByRole("button", { name: /add to cart/i });
      await user.click(addButtons[0]); // Add Apple

      await user.click(screen.getByRole("button", { name: /✕/i }));

      expect(screen.getByText(/cart \(0 items\)/i)).toBeInTheDocument();
      expect(screen.queryByText(/apple × 1/i)).not.toBeInTheDocument();
    });

    test("CLEAR action — empties the cart", async () => {
      const user = userEvent.setup();
      render(<Step5_useReducer_CustomHooks />);

      const addButtons = screen.getAllByRole("button", { name: /add to cart/i });
      await user.click(addButtons[0]); // Apple
      await user.click(addButtons[1]); // Banana

      await user.click(screen.getByRole("button", { name: /clear cart/i }));

      expect(screen.getByText(/cart \(0 items\)/i)).toBeInTheDocument();
      expect(screen.getByText(/total: \$0\.00/i)).toBeInTheDocument();
    });

    test("calculates total correctly", async () => {
      const user = userEvent.setup();
      render(<Step5_useReducer_CustomHooks />);

      const addButtons = screen.getAllByRole("button", { name: /add to cart/i });
      await user.click(addButtons[0]); // Apple $1.50
      await user.click(addButtons[1]); // Banana $0.80

      expect(screen.getByText(/total: \$2\.30/i)).toBeInTheDocument();
    });
  });

  // --- useFetch custom hook (via PostViewer UI) ---
  describe("PostViewer (useFetch hook)", () => {
    afterEach(() => vi.restoreAllMocks());

    test("shows loading then displays post title", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        json: async () => ({ title: "sunt aut facere" }),
      });

      render(<Step5_useReducer_CustomHooks />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
      await screen.findByText(/sunt aut facere/i);
    });

    test("navigates to next post on Next click", async () => {
      const user = userEvent.setup();
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ json: async () => ({ title: "Post One" }) })
        .mockResolvedValueOnce({ json: async () => ({ title: "Post Two" }) });

      render(<Step5_useReducer_CustomHooks />);
      await screen.findByText(/post one/i);

      await user.click(screen.getByRole("button", { name: /next/i }));
      await screen.findByText(/post two/i);

      expect(screen.getByText(/post #2/i)).toBeInTheDocument();
    });

    test("does not go below post #1 on Prev click", async () => {
      const user = userEvent.setup();
      vi.spyOn(global, "fetch").mockResolvedValue({
        json: async () => ({ title: "Post One" }),
      });

      render(<Step5_useReducer_CustomHooks />);
      await screen.findByText(/post one/i);

      await user.click(screen.getByRole("button", { name: /prev/i }));

      expect(screen.getByText(/post #1/i)).toBeInTheDocument();
    });
  });

  // --- useLocalStorage custom hook (via Notepad UI) ---
  describe("Notepad (useLocalStorage hook)", () => {
    beforeEach(() => localStorage.clear());

    test("renders textarea and char count", () => {
      render(<Step5_useReducer_CustomHooks />);
      expect(screen.getByPlaceholderText(/type a note/i)).toBeInTheDocument();
      expect(screen.getByText(/saved: 0 chars/i)).toBeInTheDocument();
    });

    test("updates char count as user types", async () => {
      const user = userEvent.setup();
      render(<Step5_useReducer_CustomHooks />);

      await user.type(screen.getByPlaceholderText(/type a note/i), "Hello");
      expect(screen.getByText(/saved: 5 chars/i)).toBeInTheDocument();
    });

    test("persists value to localStorage", async () => {
      const user = userEvent.setup();
      render(<Step5_useReducer_CustomHooks />);

      await user.type(screen.getByPlaceholderText(/type a note/i), "Hi");
      expect(localStorage.getItem("my-note")).toBe('"Hi"');
    });
  });

  // --- renderHook — testing cartReducer logic in isolation ---
  describe("cartReducer logic via renderHook", () => {
    function cartReducer(state, action) {
      switch (action.type) {
        case "ADD": {
          const exists = state.find((i) => i.id === action.payload.id);
          if (exists) return state.map((i) => i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i);
          return [...state, { ...action.payload, qty: 1 }];
        }
        case "REMOVE": return state.filter((i) => i.id !== action.payload);
        case "CLEAR":  return [];
        default:       return state;
      }
    }

    test("ADD dispatches correctly", () => {
      const { result } = renderHook(() => useReducer(cartReducer, []));

      act(() => {
        result.current[1]({ type: "ADD", payload: { id: 1, name: "Apple", price: 1.5 } });
      });

      expect(result.current[0]).toHaveLength(1);
      expect(result.current[0][0].qty).toBe(1);
    });

    test("ADD increments qty for duplicate item", () => {
      const { result } = renderHook(() => useReducer(cartReducer, []));

      act(() => {
        result.current[1]({ type: "ADD", payload: { id: 1, name: "Apple", price: 1.5 } });
      });
      act(() => {
        result.current[1]({ type: "ADD", payload: { id: 1, name: "Apple", price: 1.5 } });
      });

      expect(result.current[0][0].qty).toBe(2);
    });

    test("REMOVE removes the correct item", () => {
      const { result } = renderHook(() =>
        useReducer(cartReducer, [{ id: 1, name: "Apple", price: 1.5, qty: 1 }])
      );

      act(() => {
        result.current[1]({ type: "REMOVE", payload: 1 });
      });

      expect(result.current[0]).toHaveLength(0);
    });

    test("CLEAR empties the cart", () => {
      const { result } = renderHook(() =>
        useReducer(cartReducer, [
          { id: 1, name: "Apple", price: 1.5, qty: 1 },
          { id: 2, name: "Banana", price: 0.8, qty: 2 },
        ])
      );

      act(() => {
        result.current[1]({ type: "CLEAR" });
      });

      expect(result.current[0]).toHaveLength(0);
    });
  });
});
