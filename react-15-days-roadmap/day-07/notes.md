# Day 07 - useReducer & Custom Hooks

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] useReducer concept
- [ ] reducer function
- [ ] dispatch actions
- [ ] When to use useReducer vs useState
- [ ] Building custom hooks
- [ ] Reusing logic with custom hooks

---

## Key Concepts
```jsx
// useReducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    default: return state;
  }
}
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });

// Custom Hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, [url]);
  return { data, loading };
}
```

---

## Practice Task
- [ ] Rebuild Day 03 counter using useReducer
- [ ] Build a useFetch custom hook
- [ ] Use useFetch to load data from an API

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://react.dev/reference/react/useReducer
- https://react.dev/learn/reusing-logic-with-custom-hooks

---

## Interview Questions

**Q1. What is useReducer and when do you use it?**
> useReducer is an alternative to useState for managing complex state logic. Use it when state has multiple sub-values or when the next state depends on the previous one in complex ways.

**Q2. What is the difference between useState and useReducer?**
> useState is simpler for single values. useReducer is better for complex state with multiple actions (like Redux). useReducer keeps state logic in one place (the reducer function).

**Q3. What is a reducer function?**
> A pure function that takes the current state and an action, and returns the new state. It should have no side effects: `(state, action) => newState`.

**Q4. What is a custom hook?**
> A custom hook is a JavaScript function that starts with `use` and can call other hooks. It lets you extract and reuse stateful logic across multiple components.

**Q5. What are the rules of hooks?**
> 1. Only call hooks at the top level (not inside loops, conditions, or nested functions)
> 2. Only call hooks from React function components or custom hooks

**Q6. What is the difference between a custom hook and a utility function?**
> A custom hook can use React hooks (useState, useEffect, etc.) inside it. A utility function cannot. If your reusable logic needs React hooks, it must be a custom hook.
