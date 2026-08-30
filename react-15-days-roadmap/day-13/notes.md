# Day 13 - Testing Basics

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] Why testing matters
- [ ] Jest basics
- [ ] React Testing Library setup
- [ ] render, screen, fireEvent
- [ ] Testing a component
- [ ] Testing user interactions
- [ ] Mocking API calls

---

## Key Concepts
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('renders counter', () => {
  render(<Counter />);
  expect(screen.getByText('0')).toBeInTheDocument();
});

test('increments on click', () => {
  render(<Counter />);
  fireEvent.click(screen.getByText('Increment'));
  expect(screen.getByText('1')).toBeInTheDocument();
});

// Mock API
jest.mock('./api', () => ({
  getUsers: jest.fn(() => Promise.resolve([{ id: 1, name: 'John' }]))
}));
```

---

## Practice Task
- [ ] Write a test for your Counter component
- [ ] Write a test for your login form validation
- [ ] Write a test that mocks an API call

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://testing-library.com/docs/react-testing-library/intro

---

## Interview Questions

**Q1. Why is testing important in React?**
> Tests catch bugs early, give confidence when refactoring, serve as documentation, and prevent regressions. They are especially important in team environments and production apps.

**Q2. What is the difference between Jest and React Testing Library?**
> Jest is the test runner and assertion library. React Testing Library (RTL) provides utilities to render components and query the DOM. They are used together — Jest runs the tests, RTL helps write them.

**Q3. What is the philosophy of React Testing Library?**
> Test your app the way a user would use it. Query elements by text, role, or label — not by class names or IDs. This makes tests more resilient to implementation changes.

**Q4. What is the difference between unit, integration, and e2e tests?**
> - Unit: tests a single function or component in isolation
> - Integration: tests how multiple components work together
> - E2E (end-to-end): tests the full app flow in a real browser (Cypress, Playwright)

**Q5. What is mocking in tests?**
> Mocking replaces real implementations (like API calls) with fake ones that return controlled data. This makes tests fast, predictable, and independent of external services.

**Q6. What is the difference between getBy, queryBy, and findBy in RTL?**
> - `getBy`: throws if element not found (synchronous)
> - `queryBy`: returns null if not found, no throw (synchronous)
> - `findBy`: returns a promise, used for async elements that appear after a delay
