// ============================================
// TEST: Step 1 — JSX & Components
// ============================================
// RTL Philosophy: test what the USER sees, not implementation details.
//
// Key RTL queries (in priority order):
//   getByRole      → best: finds by ARIA role (button, heading, etc.)
//   getByText      → finds by visible text content
//   getByLabelText → for form inputs linked to a <label>
//   getByPlaceholderText → for inputs with placeholder
//   queryBy*       → like getBy* but returns null instead of throwing (use for "not present" checks)
//   findBy*        → async version, returns a Promise

import { render, screen } from "@testing-library/react";
import Step1_JSX_Components from "../components/Step1_JSX_Components";

describe("Step 1 — JSX & Components", () => {

  // render() mounts the component into a virtual DOM (jsdom)
  // screen gives you access to query that DOM
  beforeEach(() => {
    render(<Step1_JSX_Components />);
  });

  // --- Rendering & Text ---
  test("renders the main heading", () => {
    // getByRole is preferred — matches <h1> with role="heading" and its text
    const heading = screen.getByRole("heading", { name: /step 1: jsx & components/i });
    expect(heading).toBeInTheDocument(); // jest-dom matcher
  });

  test("renders Greeting with embedded JS expression", () => {
    // getByText finds any element containing this text
    expect(screen.getByText(/hello, ali/i)).toBeInTheDocument();
    expect(screen.getByText(/2 \+ 2 = 4/i)).toBeInTheDocument();
  });

  // --- Props ---
  test("renders UserCard with correct props", () => {
    expect(screen.getByText("Ali")).toBeInTheDocument();
    expect(screen.getByText("Age: 25")).toBeInTheDocument();
  });

  test("renders default role prop when not provided", () => {
    // John has no role prop → should fall back to default "User"
    expect(screen.getByText("John")).toBeInTheDocument();
    // getAllByText because "Role: User" appears for both Ali and John
    const defaultRoles = screen.getAllByText(/role: user/i);
    expect(defaultRoles.length).toBeGreaterThanOrEqual(1);
  });

  // --- Lists ---
  test("renders all 3 users from the list", () => {
    expect(screen.getByText("Ali")).toBeInTheDocument();
    expect(screen.getByText("Sara")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  // --- Conditional Rendering ---
  test("renders online status badge", () => {
    expect(screen.getByText(/🟢 online/i)).toBeInTheDocument();
  });

  test("renders offline status badge", () => {
    expect(screen.getByText(/🔴 offline/i)).toBeInTheDocument();
  });
});
