// ============================================
// STEP 7: FORMS IN REACT
// ============================================
// Two approaches to forms in React:
//
// 1. Controlled Components  → React state drives the input value (recommended)
// 2. Uncontrolled Components → DOM drives the value, read via ref
//
// Controlled = you always know the current value in state.

import { useState, useRef } from "react";

// ---- Controlled Form ----
// Every input is tied to state. onChange updates state → React re-renders.
function RegistrationForm() {
  const [form, setForm] = useState({
    username: "",
    email:    "",
    password: "",
    role:     "user",
    agree:    false,
  });
  const [submitted, setSubmitted] = useState(null);
  const [errors,    setErrors]    = useState({});

  // Single handler for all inputs using the input's "name" attribute
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      // checkboxes use "checked", everything else uses "value"
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Simple validation
  const validate = () => {
    const errs = {};
    if (!form.username)           errs.username = "Username is required";
    if (!form.email.includes("@")) errs.email   = "Valid email required";
    if (form.password.length < 6) errs.password = "Min 6 characters";
    if (!form.agree)              errs.agree    = "You must agree";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(form); // save submitted data
  };

  if (submitted) {
    return (
      <div>
        <h3>✅ Registered!</h3>
        <pre>{JSON.stringify(submitted, null, 2)}</pre>
        <button onClick={() => setSubmitted(null)}>Register Another</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "300px" }}>
      <div>
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        {errors.username && <span style={{ color: "red" }}> {errors.username}</span>}
      </div>

      <div>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        {errors.email && <span style={{ color: "red" }}> {errors.email}</span>}
      </div>

      <div>
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {errors.password && <span style={{ color: "red" }}> {errors.password}</span>}
      </div>

      {/* Select dropdown */}
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
      </select>

      {/* Checkbox */}
      <label>
        <input
          name="agree"
          type="checkbox"
          checked={form.agree}
          onChange={handleChange}
        />
        {" "}I agree to terms
        {errors.agree && <span style={{ color: "red" }}> {errors.agree}</span>}
      </label>

      <button type="submit">Register</button>
    </form>
  );
}

// ---- Uncontrolled Form (using useRef) ----
// DOM manages the value. You read it only when needed (e.g., on submit).
// Simpler for forms where you don't need live validation.
function LoginForm() {
  const emailRef    = useRef();
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Read values directly from DOM via ref
    alert(`Login: ${emailRef.current.value} / ${passwordRef.current.value}`);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "300px" }}>
      <input ref={emailRef}    placeholder="Email"    defaultValue="" />
      <input ref={passwordRef} placeholder="Password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}

function Step7_Forms() {
  return (
    <div>
      <h1>Step 7: Forms</h1>
      <h3>Controlled Form (with validation)</h3>
      <RegistrationForm />
      <hr />
      <h3>Uncontrolled Form (useRef)</h3>
      <LoginForm />
    </div>
  );
}

export default Step7_Forms;
