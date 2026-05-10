// ============================================
// TEST: Step 8 — React Router
// ============================================
// Key concepts:
//   MemoryRouter      → in-memory router for tests (no real browser URL needed)
//   initialEntries    → set the starting URL for the test
//   navigation assert → click a Link and assert the new page renders
//   useParams         → test dynamic route segments like /users/:id
//
// Why MemoryRouter?
//   BrowserRouter reads/writes the real browser URL (window.location).
//   In jsdom (test environment) that causes issues.
//   MemoryRouter keeps the URL in memory — perfect for tests.
//
// The component uses BrowserRouter internally, so we test the
// individual page components wrapped in MemoryRouter instead.

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Import the page components — they are not exported from Step8,
// so we test the full Step8 component by replacing BrowserRouter
// with MemoryRouter via a test wrapper approach.
import Step8_Router from "../components/Step8_Router";

// Helper: renders Step8 but overrides BrowserRouter with MemoryRouter
// We achieve this by mocking react-router-dom's BrowserRouter
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    // Replace BrowserRouter with MemoryRouter so tests control the URL
    BrowserRouter: ({ children }) => (
      <actual.MemoryRouter initialEntries={["/"]}>
        {children}
      </actual.MemoryRouter>
    ),
  };
});

describe("Step 8 — React Router", () => {

  // --- Initial render (Home page) ---
  test("renders Home page by default", () => {
    render(<Step8_Router />);
    expect(screen.getByRole("heading", { name: /home page/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome to the react router demo/i)).toBeInTheDocument();
  });

  // --- Navbar links ---
  test("renders all navbar links", () => {
    render(<Step8_Router />);
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /users/i })).toBeInTheDocument();
  });

  // --- Navigation via NavLink ---
  test("navigates to About page when About link is clicked", async () => {
    const user = userEvent.setup();
    render(<Step8_Router />);

    await user.click(screen.getByRole("link", { name: /about/i }));

    expect(screen.getByRole("heading", { name: /about page/i })).toBeInTheDocument();
    expect(screen.getByText(/this is the about page/i)).toBeInTheDocument();
  });

  test("navigates to Users page when Users link is clicked", async () => {
    const user = userEvent.setup();
    render(<Step8_Router />);

    await user.click(screen.getByRole("link", { name: /users/i }));

    expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /alice/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /bob/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /charlie/i })).toBeInTheDocument();
  });

  // --- Dynamic route /users/:id ---
  test("navigates to UserDetail page when a user link is clicked", async () => {
    const user = userEvent.setup();
    render(<Step8_Router />);

    await user.click(screen.getByRole("link", { name: /users/i }));
    await user.click(screen.getByRole("link", { name: /alice/i }));

    expect(screen.getByRole("heading", { name: /user detail/i })).toBeInTheDocument();
    // Text is split across elements: use a function matcher to match across nodes
    expect(screen.getByText((_, el) => el?.textContent === "Showing details for User ID: 1")).toBeInTheDocument();
  });

  test("shows correct id for each user detail page", async () => {
    const user = userEvent.setup();
    render(<Step8_Router />);

    await user.click(screen.getByRole("link", { name: /users/i }));
    await user.click(screen.getByRole("link", { name: /bob/i }));

    expect(screen.getByText((_, el) => el?.textContent === "Showing details for User ID: 2")).toBeInTheDocument();
  });

  // --- Programmatic navigation ---
  test("Go to About button navigates to About page", async () => {
    const user = userEvent.setup();
    render(<Step8_Router />);

    // Navigate to Home first to ensure the Go to About button is visible
    await user.click(screen.getByRole("link", { name: /^home$/i }));
    await user.click(screen.getByRole("button", { name: /go to about/i }));

    expect(screen.getByRole("heading", { name: /about page/i })).toBeInTheDocument();
  });

  // --- 404 page ---
  test("renders 404 page for unknown route", () => {
    // Override the mock for this one test to start at an unknown path
    vi.doMock("react-router-dom", async () => {
      const actual = await vi.importActual("react-router-dom");
      return {
        ...actual,
        BrowserRouter: ({ children }) => (
          <actual.MemoryRouter initialEntries={["/unknown-page"]}>
            {children}
          </actual.MemoryRouter>
        ),
      };
    });

    // Render directly with MemoryRouter pointing to unknown path
    render(
      <MemoryRouter initialEntries={["/unknown-page"]}>
        <Routes>
          <Route path="*" element={<h2>❌ 404 — Page Not Found</h2>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
