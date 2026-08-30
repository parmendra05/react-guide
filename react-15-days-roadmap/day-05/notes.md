# Day 05 - useEffect

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] What is useEffect
- [ ] Dependency array
- [ ] Run on mount only
- [ ] Run on state change
- [ ] Cleanup function
- [ ] Fetching data with useEffect

---

## Key Concepts
```jsx
import { useEffect } from 'react';

// Runs every render
useEffect(() => { console.log('render') });

// Runs once on mount
useEffect(() => { console.log('mounted') }, []);

// Runs when count changes
useEffect(() => { console.log(count) }, [count]);

// Cleanup
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // cleanup
}, []);
```

---

## Practice Task
- [ ] Fetch data from https://jsonplaceholder.typicode.com/users
- [ ] Show loading spinner while fetching
- [ ] Show error message if fetch fails
- [ ] Display users in a list

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://react.dev/reference/react/useEffect

---

## Interview Questions

**Q1. What is useEffect used for?**
> useEffect is used for side effects — things that happen outside of rendering like fetching data, setting up subscriptions, updating the DOM, or setting timers.

**Q2. What does the dependency array do in useEffect?**
> It controls when the effect runs:
> - No array: runs after every render
> - Empty array `[]`: runs only once on mount
> - `[value]`: runs when `value` changes

**Q3. What is the cleanup function in useEffect?**
> The function returned from useEffect runs before the component unmounts or before the effect runs again. Used to clear timers, cancel subscriptions, or abort fetch requests.

**Q4. What happens if you don't add a dependency to the dependency array?**
> You get a stale closure bug — the effect uses an outdated value of the variable. Always include all values used inside the effect in the dependency array.

**Q5. Can you use async/await directly in useEffect?**
> No. useEffect callback cannot be async directly. Define an async function inside and call it:
> ```js
> useEffect(() => {
>   async function load() { await fetchData(); }
>   load();
> }, []);
> ```

**Q6. What is the difference between useEffect and componentDidMount?**
> `useEffect(() => {}, [])` is the functional equivalent of componentDidMount. But useEffect also covers componentDidUpdate and componentWillUnmount depending on how it's configured.
