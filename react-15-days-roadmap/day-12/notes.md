# Day 12 - Performance Optimization

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] React.memo
- [ ] useMemo
- [ ] useCallback
- [ ] Lazy loading (React.lazy)
- [ ] Suspense
- [ ] When to optimize (don't over-optimize)

---

## Key Concepts
```jsx
// React.memo - prevent re-render if props unchanged
const UserCard = React.memo(({ name }) => <p>{name}</p>);

// useMemo - cache expensive calculation
const total = useMemo(() => items.reduce((a, b) => a + b.price, 0), [items]);

// useCallback - cache function reference
const handleClick = useCallback(() => {
  console.log(id);
}, [id]);

// Lazy loading
const Dashboard = React.lazy(() => import('./Dashboard'));
<Suspense fallback={<p>Loading...</p>}>
  <Dashboard />
</Suspense>
```

---

## Practice Task
- [ ] Add React.memo to a component that re-renders too often
- [ ] Use useMemo for a filtered list
- [ ] Lazy load a heavy page component

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://react.dev/reference/react/memo
- https://react.dev/reference/react/useMemo

---

## Interview Questions

**Q1. What is the Virtual DOM and how does it improve performance?**
> The Virtual DOM is a lightweight in-memory copy of the real DOM. React updates the Virtual DOM first, diffs it with the previous version, and only updates the changed parts in the real DOM. This is faster than updating the real DOM directly.

**Q2. What is React.memo?**
> React.memo is a HOC that prevents a component from re-rendering if its props haven't changed. It does a shallow comparison of props. Use it for components that render often with the same props.

**Q3. What is the difference between useMemo and useCallback?**
> `useMemo` caches the result of a calculation. `useCallback` caches a function reference. Both prevent unnecessary recalculations/re-creations on every render.

**Q4. When should you NOT use useMemo/useCallback?**
> When the computation is cheap or the component rarely re-renders. Over-optimization adds complexity and can actually hurt performance due to the overhead of memoization itself.

**Q5. What is code splitting and why is it important?**
> Code splitting breaks your app into smaller chunks that are loaded on demand instead of all at once. This reduces the initial bundle size and speeds up the first load. React.lazy + Suspense enables this.

**Q6. What is reconciliation in React?**
> Reconciliation is the process React uses to compare the new Virtual DOM with the previous one (diffing) and determine the minimum number of changes needed to update the real DOM.
