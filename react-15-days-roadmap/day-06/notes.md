# Day 06 - useRef & useContext

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] useRef - DOM access
- [ ] useRef - persist value without re-render
- [ ] useContext - create context
- [ ] useContext - provide context
- [ ] useContext - consume context

---

## Key Concepts
```jsx
// useRef
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();

// useContext
const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}

function Child() {
  const theme = useContext(ThemeContext);
  return <p>Theme: {theme}</p>;
}
```

---

## Practice Task
- [ ] Auto-focus an input on page load using useRef
- [ ] Build a theme switcher (dark/light) using useContext

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://react.dev/reference/react/useRef
- https://react.dev/reference/react/useContext

---

## Interview Questions

**Q1. What is useRef used for?**
> Two main uses: (1) accessing a DOM element directly (like focus, scroll), and (2) storing a mutable value that persists across renders without causing a re-render.

**Q2. What is the difference between useRef and useState?**
> Both persist values across renders. But changing a ref value does NOT trigger a re-render, while changing state does. Use ref for values you don't want to display in the UI.

**Q3. What is the Context API?**
> Context API is React's built-in way to share data globally across the component tree without prop drilling. You create a context, provide a value at the top, and consume it anywhere below.

**Q4. When should you use useContext?**
> For global data that many components need: current user, theme, language, auth token. Avoid using it for frequently changing state as it re-renders all consumers.

**Q5. What is the difference between useContext and prop drilling?**
> Prop drilling passes data through every intermediate component. useContext lets any component access the data directly without passing it through the tree.

**Q6. Does useContext cause re-renders?**
> Yes. Every component that consumes a context re-renders when the context value changes. For performance-sensitive cases, consider splitting contexts or using Zustand.
