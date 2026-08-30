# Day 14 - Advanced Patterns

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] Higher Order Components (HOC)
- [ ] Render Props pattern
- [ ] Compound Components
- [ ] Error Boundaries
- [ ] Portals

---

## Key Concepts
```jsx
// HOC - adds auth check to any component
function withAuth(Component) {
  return function AuthComponent(props) {
    if (!isLoggedIn) return <Navigate to="/login" />;
    return <Component {...props} />;
  };
}
const ProtectedDashboard = withAuth(Dashboard);

// Error Boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}

// Portal - render outside root div
ReactDOM.createPortal(<Modal />, document.getElementById('modal-root'));
```

---

## Practice Task
- [ ] Build a withAuth HOC for protected pages
- [ ] Wrap your app with an Error Boundary
- [ ] Build a Modal using Portals

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

---

## Interview Questions

**Q1. What is a Higher Order Component (HOC)?**
> A HOC is a function that takes a component and returns a new enhanced component. It's used to reuse component logic like auth checks, logging, or data fetching. Example: `withAuth(Dashboard)`.

**Q2. What is the difference between HOC and custom hooks?**
> HOCs wrap components and add behavior at the component level. Custom hooks share stateful logic without changing the component tree. Hooks are preferred in modern React as they are simpler and more composable.

**Q3. What is an Error Boundary?**
> An Error Boundary is a class component that catches JavaScript errors in its child component tree and displays a fallback UI instead of crashing the whole app. Functional components cannot be error boundaries.

**Q4. What errors do Error Boundaries NOT catch?**
> They don't catch errors in: event handlers, async code (setTimeout, fetch), server-side rendering, or errors in the error boundary itself.

**Q5. What are React Portals?**
> Portals let you render a component outside its parent DOM node while keeping it in the React component tree. Useful for modals, tooltips, and dropdowns that need to escape overflow:hidden or z-index constraints.

**Q6. What is the Render Props pattern?**
> A pattern where a component receives a function as a prop and calls it to render UI. It shares logic between components. Example: `<Mouse render={(pos) => <Cat position={pos} />} />`. Largely replaced by custom hooks.
