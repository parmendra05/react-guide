// ============================================
// TEST: Step 7 — Forms
// ============================================
// Key concepts:
//   userEvent.type         → type into controlled inputs
//   userEvent.selectOptions → pick a value from <select>
//   userEvent.click        → click checkbox or submit button
//   validation messages    → assert error text appears/disappears
//   success state          → assert form switches to success view

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Step7_Forms from "../components/Step7_Forms";

describe("Step 7 — Forms", () => {

  // --- RegistrationForm (controlled + validation) ---
  describe("RegistrationForm", () => {

    // Both forms share "Email" placeholder — grab the first one (RegistrationForm)
    const getRegEmail = () => screen.getAllByPlaceholderText("Email")[0];
    const getRegPassword = () => screen.getAllByPlaceholderText("Password")[0];

    // Helper: fills the form with valid data
    async function fillValidForm(user) {
      await user.type(screen.getByPlaceholderText("Username"), "Ali");
      await user.type(getRegEmail(), "ali@test.com");
      await user.type(getRegPassword(), "secret123");
      await user.click(screen.getByRole("checkbox"));
    }

    test("renders all form fields", () => {
      render(<Step7_Forms />);
      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText("Email")[0]).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText("Password")[0]).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument(); // <select>
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    });

    // --- Validation errors ---
    test("shows all validation errors when submitted empty", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      await user.click(screen.getByRole("button", { name: /register/i }));

      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/valid email required/i)).toBeInTheDocument();
      expect(screen.getByText(/min 6 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/you must agree/i)).toBeInTheDocument();
    });

    test("shows email error for invalid email", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      await user.type(getRegEmail(), "notanemail");
      await user.click(screen.getByRole("button", { name: /register/i }));

      expect(screen.getByText(/valid email required/i)).toBeInTheDocument();
    });

    test("shows password error for short password", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      await user.type(getRegPassword(), "abc");
      await user.click(screen.getByRole("button", { name: /register/i }));

      expect(screen.getByText(/min 6 characters/i)).toBeInTheDocument();
    });

    test("shows agree error when checkbox is unchecked", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      await user.type(screen.getByPlaceholderText("Username"), "Ali");
      await user.type(getRegEmail(), "ali@test.com");
      await user.type(getRegPassword(), "secret123");
      // checkbox NOT clicked
      await user.click(screen.getByRole("button", { name: /register/i }));

      expect(screen.getByText(/you must agree/i)).toBeInTheDocument();
    });

    // --- Successful submission ---
    test("shows success view with submitted data on valid submit", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /register/i }));

      expect(screen.getByText(/✅ registered/i)).toBeInTheDocument();
      expect(screen.getByText(/ali@test\.com/i)).toBeInTheDocument();
    });

    test("no validation errors shown on valid submit", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /register/i }));

      expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/valid email required/i)).not.toBeInTheDocument();
    });

    test("Register Another button resets form back", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      await fillValidForm(user);
      await user.click(screen.getByRole("button", { name: /register/i }));
      await user.click(screen.getByRole("button", { name: /register another/i }));

      expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    });

    // --- Select dropdown ---
    test("select defaults to User role", () => {
      render(<Step7_Forms />);
      expect(screen.getByRole("combobox")).toHaveValue("user");
    });

    test("select changes to Admin when chosen", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      await user.selectOptions(screen.getByRole("combobox"), "admin");
      expect(screen.getByRole("combobox")).toHaveValue("admin");
    });

    // --- Checkbox ---
    test("checkbox is unchecked by default", () => {
      render(<Step7_Forms />);
      expect(screen.getByRole("checkbox")).not.toBeChecked();
    });

    test("checkbox becomes checked when clicked", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      await user.click(screen.getByRole("checkbox"));
      expect(screen.getByRole("checkbox")).toBeChecked();
    });
  });

  // --- LoginForm (uncontrolled with useRef) ---
  // Both forms share "Email" and "Password" placeholders — grab the second one (LoginForm)
  describe("LoginForm (uncontrolled)", () => {
    test("renders email and password inputs and login button", () => {
      render(<Step7_Forms />);
      expect(screen.getAllByPlaceholderText("Email")[1]).toBeInTheDocument();
      expect(screen.getAllByPlaceholderText("Password")[1]).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    test("can type into uncontrolled inputs", async () => {
      const user = userEvent.setup();
      render(<Step7_Forms />);

      const loginEmailInput = screen.getAllByPlaceholderText("Email")[1];
      await user.type(loginEmailInput, "test@test.com");

      // getByDisplayValue checks the current DOM value of an input
      expect(screen.getByDisplayValue("test@test.com")).toBeInTheDocument();
    });
  });
});
