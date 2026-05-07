# ⚛️ React Guide

A personal step-by-step reference project covering core React concepts and unit testing with RTL & Vitest.

## Topics Covered

| Step | Topic |
|------|-------|
| 1 | JSX & Components — functional components, props, lists, conditional rendering |
| 2 | useState — local state management |
| 3 | useEffect — side effects and lifecycle |
| 4 | useRef & useContext — refs and context API |
| 5 | useReducer & Custom Hooks — complex state and reusable logic |
| 6 | Performance — React.memo, useMemo, useCallback |
| 7 | Forms — controlled inputs and form handling |
| 8 | React Router — client-side routing with react-router-dom |

## Tech Stack

- React 18
- React Router DOM v7
- Vite (migrated from CRA)
- Vitest + React Testing Library

## Getting Started

```bash
npm install
npm start       # dev server
npm test        # run tests (watch mode)
npx vitest run  # run tests once
```

App runs at `http://localhost:3000`. Use the sidebar to navigate between steps.

## Project Structure

```
src/
├── App.jsx
├── setupTests.js                    # jest-dom matchers setup
├── components/
│   ├── Step1_JSX_Components.jsx
│   ├── Step2_useState.jsx
│   ├── Step3_useEffect.jsx
│   ├── Step4_useRef_useContext.jsx
│   ├── Step5_useReducer_CustomHooks.jsx
│   ├── Step6_Performance.jsx
│   ├── Step7_Forms.jsx
│   └── Step8_Router.jsx
└── __tests__/
    ├── Step1_JSX_Components.test.jsx
    ├── Step2_useState.test.jsx
    ├── Step3_useEffect.test.jsx
    ├── Step4_useRef_useContext.test.jsx
    ├── Step5_useReducer_CustomHooks.test.jsx
    ├── Step6_Performance.test.jsx
    ├── Step7_Forms.test.jsx
    └── Step8_Router.test.jsx
```

## Testing Curriculum

| Step | Concepts Tested | Key RTL/Vitest APIs |
|------|----------------|---------------------|
| 1 | render, text, props, lists, conditional | `getByRole`, `getByText`, `getAllByText` |
| 2 | useState, user interactions | `userEvent.click`, `userEvent.type`, `queryByText` |
| 3 | useEffect, async, mocking fetch | `findBy*`, `vi.fn()`, `vi.spyOn()` |
| 4 | useRef, useContext | `getByDisplayValue`, custom context wrapper |
| 5 | useReducer, custom hooks | `renderHook`, `act()` |
| 6 | React.memo, useMemo, useCallback | `vi.fn()` call count assertions |
| 7 | Forms, validation, submit | `userEvent.type`, `userEvent.submit` |
| 8 | React Router | `MemoryRouter`, navigation assertions |

---

## 🧪 Unit Testing — Complete Beginner's Guide

### What is Unit Testing?

A unit test checks that a **small, isolated piece of your app** (a component, a function) works correctly.
Instead of manually clicking through the browser every time, you write code that does the checking for you — automatically, in milliseconds.

```
You write code → You write a test for that code → Run the test → ✅ Pass or ❌ Fail
```

---

### Why Test?

- Catch bugs before users do
- Refactor confidently — if tests still pass, nothing broke
- Tests act as living documentation of how your code is supposed to behave
- Required in every professional React project

---

### Tools Used in This Project

| Tool | Role |
|------|------|
| **Vitest** | Test runner — finds and runs your test files |
| **React Testing Library (RTL)** | Renders components and lets you query the DOM |
| **@testing-library/jest-dom** | Extra matchers like `toBeInTheDocument()` |
| **@testing-library/user-event** | Simulates real user actions (click, type, etc.) |
| **jsdom** | Fake browser environment so tests run in Node.js |

---

### Mental Model — The Golden Rule of RTL

> **Test what the user sees and does, not how the code works internally.**

❌ Don't test: "does the `count` state variable equal 1?"  
✅ Do test: "does the screen show `Counter: 1` after clicking +1?"

This makes your tests resilient — they won't break when you refactor internals.

---

### Anatomy of a Test File

```jsx
import { render, screen } from "@testing-library/react";
import MyComponent from "../components/MyComponent";

// describe() groups related tests together
describe("MyComponent", () => {

  // test() defines a single test case
  test("renders a heading", () => {

    // 1. ARRANGE — render the component
    render(<MyComponent />);

    // 2. ACT — find an element (query the DOM)
    const heading = screen.getByRole("heading", { name: /hello/i });

    // 3. ASSERT — check it meets expectations
    expect(heading).toBeInTheDocument();
  });
});
```

Every test follows the same 3-step pattern: **Arrange → Act → Assert**.

---

### RTL Query Cheat Sheet

Use queries in this priority order:

| Query | Use when | Throws if missing? |
|-------|----------|--------------------|
| `getByRole` | ✅ First choice — buttons, headings, inputs | Yes |
| `getByLabelText` | Form inputs linked to a `<label>` | Yes |
| `getByPlaceholderText` | Inputs with a placeholder | Yes |
| `getByText` | Any element by its visible text | Yes |
| `getByDisplayValue` | Current value of an input/select | Yes |
| `queryByText` | Checking something is **NOT** present | No — returns null |
| `findByText` | Element that appears **asynchronously** | Yes — returns Promise |

**Rule of thumb:**
- `getBy*` — expect the element to exist right now
- `queryBy*` — expect it to be absent (`expect(...).not.toBeInTheDocument()`)
- `findBy*` — element appears after an async operation (API call, useEffect)

---

### jest-dom Matcher Cheat Sheet

```js
expect(element).toBeInTheDocument()            // element exists in the DOM
expect(element).not.toBeInTheDocument()        // element does NOT exist
expect(element).toBeVisible()                  // element is visible to the user
expect(element).toBeDisabled()                 // button/input is disabled
expect(element).toHaveTextContent("Hello")     // element contains this text
expect(element).toHaveValue("Ali")             // input has this value
expect(element).toHaveAttribute("href", "/home") // element has this attribute
```

---

### userEvent Cheat Sheet

Always `await` every userEvent action:

```js
const user = userEvent.setup(); // create once per test

await user.click(button);                   // click a button
await user.type(input, "Hello");            // type into an input
await user.clear(input);                    // clear an input
await user.selectOptions(select, "admin");  // pick from <select>
await user.keyboard("{Enter}");             // press a key
```

> `userEvent` is preferred over `fireEvent` because it fires all real browser events
> (mousedown, mouseup, click, focus, keydown, keyup) just like a real user would.

---

### How to Run Tests

```bash
npx vitest run                                                    # run all tests once
npm test                                                          # watch mode — reruns on save
npx vitest run --reporter=verbose                                 # show each test name
npx vitest run src/__tests__/Step1_JSX_Components.test.jsx        # run one file
```

---

### Step-by-Step Learning Path for Beginners

Follow this order — each step builds on the previous one:

#### Step 1 — Render and query
- Concepts: `render()`, `screen`, `getByRole`, `getByText`, `toBeInTheDocument`
- File: `src/__tests__/Step1_JSX_Components.test.jsx`
- Goal: Render a component and assert the right text/elements appear

#### Step 2 — Simulate user interactions
- Concepts: `userEvent.click`, `userEvent.type`, `queryByText`, `describe` nesting
- File: `src/__tests__/Step2_useState.test.jsx`
- Goal: Click buttons, type into inputs, assert state-driven UI changes

#### Step 3 — Async testing
- Concepts: `findBy*`, `vi.fn()`, `vi.spyOn()`, mocking `fetch`
- File: `src/__tests__/Step3_useEffect.test.jsx`
- Goal: Test components that fetch data or run side effects

#### Step 4 — Context and refs
- Concepts: custom wrapper with `Context.Provider`, `getByDisplayValue`
- File: `src/__tests__/Step4_useRef_useContext.test.jsx`
- Goal: Provide context values in tests, test ref-driven behavior

#### Step 5 — Test hooks directly
- Concepts: `renderHook`, `act()`
- File: `src/__tests__/Step5_useReducer_CustomHooks.test.jsx`
- Goal: Test custom hooks in isolation without a UI component

#### Step 6 — Assert render counts (performance)
- Concepts: `vi.fn()` as a spy, call count assertions
- File: `src/__tests__/Step6_Performance.test.jsx`
- Goal: Verify `React.memo` / `useCallback` prevent unnecessary re-renders

#### Step 7 — Form testing
- Concepts: `userEvent.type`, `userEvent.click` on submit, validation messages
- File: `src/__tests__/Step7_Forms.test.jsx`
- Goal: Fill out and submit forms, assert validation and success states

#### Step 8 — Routing tests
- Concepts: `MemoryRouter`, navigation assertions
- File: `src/__tests__/Step8_Router.test.jsx`
- Goal: Test that links navigate to the correct pages

---

### Common Beginner Mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting to `await` userEvent actions | Always `await user.click(...)` |
| Using `getByText` for absent elements | Use `queryByText` instead |
| Using `getByText` for async content | Use `findByText` instead |
| Testing implementation details (state variables) | Test visible output instead |
| Using `fireEvent` instead of `userEvent` | `userEvent` is more realistic |

---

### File Naming Convention

```
src/
└── __tests__/
    └── Step1_JSX_Components.test.jsx   ← mirrors the component filename
```

Vitest automatically finds any file matching `**/*.test.jsx` or `**/*.spec.jsx`.
