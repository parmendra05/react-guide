# Day 01 - JSX & Components

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] What is JSX
- [ ] JSX rules (className, self-closing tags)
- [ ] Functional Components
- [ ] Rendering components
- [ ] Fragments (<> </>)

---

## Key Concepts
```jsx
// Functional Component
function Hello() {
  return <h1>Hello World</h1>;
}

// Fragment
function App() {
  return (
    <>
      <Hello />
      <p>Welcome</p>
    </>
  );
}
```

---

## Practice Task
- [ ] Create 3 components: Header, Main, Footer
- [ ] Render them all inside App.jsx

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://react.dev/learn/writing-markup-with-jsx

---

## Interview Questions

**Q1. What is JSX and why do we use it?**
> JSX is a syntax extension for JavaScript that looks like HTML. It makes writing UI components easier and more readable. Browsers don't understand JSX directly — Babel compiles it to React.createElement() calls.

**Q2. What is the difference between JSX and HTML?**
> - JSX uses `className` instead of `class`
> - JSX uses `htmlFor` instead of `for`
> - All tags must be self-closed (`<img />`, `<br />`)
> - JSX expressions use `{}` for dynamic values

**Q3. What is a React component?**
> A component is a reusable, independent piece of UI. In modern React, components are JavaScript functions that return JSX.

**Q4. What is the difference between a functional and class component?**
> Functional components are plain JS functions that return JSX. Class components extend React.Component and use render(). Functional components are preferred today because they support hooks and are simpler.

**Q5. What are React Fragments and why use them?**
> Fragments (`<> </>` or `<React.Fragment>`) let you return multiple elements without adding an extra DOM node. This keeps the DOM clean and avoids unnecessary wrapper divs.

**Q6. Can a component return multiple root elements?**
> No, a component must return a single root element. Use Fragments to wrap multiple elements without adding a real DOM node.
