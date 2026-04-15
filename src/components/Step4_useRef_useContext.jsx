// ============================================
// STEP 4: useRef & useContext
// ============================================

import { useRef, useContext, createContext, useState } from "react";

// ---- useRef ----
// useRef gives you a "box" that holds a value WITHOUT causing re-renders.
// Most common use: directly access a DOM element.
//
// ref.current = the actual DOM node or stored value

function FocusInput() {
  // inputRef.current will point to the <input> DOM element
  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus(); // directly call DOM method
  };

  return (
    <div>
      {/* Attach ref to a DOM element with the "ref" prop */}
      <input ref={inputRef} placeholder="Click button to focus me" />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}

// useRef to store a value that doesn't trigger re-render
function RenderCounter() {
  const [count, setCount]  = useState(0);
  const renderCount        = useRef(0); // won't cause re-render when changed

  renderCount.current += 1; // increment on every render

  return (
    <div>
      <p>State count: {count}</p>
      <p>This component rendered: {renderCount.current} times</p>
      <button onClick={() => setCount((c) => c + 1)}>Increment State</button>
    </div>
  );
}

// ---- useContext ----
// Context solves "prop drilling" — passing props through many layers.
// Instead, any child can READ the context value directly.
//
// 3 steps:
//   1. createContext()  → create the context
//   2. <Context.Provider value={...}>  → wrap children to provide value
//   3. useContext(Context)  → consume the value anywhere inside

// Step 1: Create context with a default value
const ThemeContext = createContext("light");

// Step 3: Deep child that consumes context (no props needed!)
function ThemedButton() {
  const theme = useContext(ThemeContext); // reads from nearest Provider above

  const style = {
    background: theme === "dark" ? "#333" : "#eee",
    color:      theme === "dark" ? "#fff" : "#000",
    padding:    "8px 16px",
    border:     "none",
    cursor:     "pointer",
  };

  return <button style={style}>I am a {theme} button</button>;
}

// Intermediate component — notice it does NOT receive or pass theme prop
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

// Step 2: Provide the context value at the top level
function ThemeApp() {
  const [theme, setTheme] = useState("light");

  return (
    // All children inside Provider can access "theme" via useContext
    <ThemeContext.Provider value={theme}>
      <div>
        <p>Current theme: {theme}</p>
        <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          Toggle Theme
        </button>
        {/* Toolbar doesn't receive theme as prop, but ThemedButton still gets it */}
        <Toolbar />
      </div>
    </ThemeContext.Provider>
  );
}

function Step4_useRef_useContext() {
  return (
    <div>
      <h1>Step 4: useRef & useContext</h1>
      <h3>useRef — DOM Access</h3>
      <FocusInput />
      <hr />
      <h3>useRef — Render Counter</h3>
      <RenderCounter />
      <hr />
      <h3>useContext — Theme</h3>
      <ThemeApp />
    </div>
  );
}

export default Step4_useRef_useContext;
