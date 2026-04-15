// ============================================
// STEP 2: useState HOOK
// ============================================
// useState lets a component "remember" values between renders.
// When state changes → React re-renders the component automatically.
//
// Syntax: const [value, setValue] = useState(initialValue)

import { useState } from "react";

// --- Example 1: Counter ---
function Counter() {
  // count = current value, setCount = function to update it
  const [count, setCount] = useState(0);

  return (
    <div>
      <h3>Counter: {count}</h3>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      {/* Always use the updater function form when new state depends on old state */}
      <button onClick={() => setCount((prev) => prev * 2)}>×2</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// --- Example 2: Toggle ---
function Toggle() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setIsVisible((prev) => !prev)}>
        {isVisible ? "Hide" : "Show"} Message
      </button>
      {/* Conditional rendering with && shortcut */}
      {isVisible && <p>👋 Hello! I am visible.</p>}
    </div>
  );
}

// --- Example 3: Object State ---
// When state is an object, always spread the old state first!
function UserForm() {
  const [user, setUser] = useState({ name: "", email: "" });

  const handleChange = (field, value) => {
    // Spread old state (...user) then override only the changed field
    setUser({ ...user, [field]: value });
  };

  return (
    <div>
      <input
        placeholder="Name"
        value={user.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <input
        placeholder="Email"
        value={user.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <p>Name: {user.name} | Email: {user.email}</p>
    </div>
  );
}

function Step2_useState() {
  return (
    <div>
      <h1>Step 2: useState</h1>
      <Counter />
      <hr />
      <Toggle />
      <hr />
      <UserForm />
    </div>
  );
}

export default Step2_useState;
