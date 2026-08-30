# Day 03 - useState

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] What is State
- [ ] useState hook
- [ ] Updating state
- [ ] State with objects
- [ ] State with arrays
- [ ] Re-rendering concept

---

## Key Concepts
```jsx
import { useState } from 'react';

// Basic state
const [count, setCount] = useState(0);

// Object state
const [user, setUser] = useState({ name: '', age: 0 });
setUser(prev => ({ ...prev, name: 'John' }));

// Array state
const [items, setItems] = useState([]);
setItems(prev => [...prev, newItem]);
```

---

## Practice Task
- [ ] Build a counter (increment, decrement, reset)
- [ ] Build a toggle (show/hide text)
- [ ] Build a simple list (add/remove items)

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://react.dev/reference/react/useState

---

## Interview Questions

**Q1. What is state in React?**
> State is data that a component manages internally. When state changes, React re-renders the component to reflect the new data in the UI.

**Q2. What is the useState hook?**
> useState is a hook that lets you add state to functional components. It returns an array with the current state value and a setter function: `const [value, setValue] = useState(initialValue)`.

**Q3. Why should you never mutate state directly?**
> React tracks state changes through the setter function. Direct mutation won't trigger a re-render, so the UI won't update. Always use the setter: `setValue(newValue)`.

**Q4. What is the difference between useState and a regular variable?**
> A regular variable resets on every render and doesn't trigger re-renders when changed. useState persists the value between renders and triggers a re-render when updated.

**Q5. How do you update state based on the previous state?**
> Use the functional form of the setter: `setCount(prev => prev + 1)`. This is important when the new state depends on the old state to avoid stale state bugs.

**Q6. Does useState update state synchronously?**
> No. State updates are asynchronous and batched. React may batch multiple setState calls together and apply them in one re-render for performance.
