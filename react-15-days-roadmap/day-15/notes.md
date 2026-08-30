# Day 15 - Final Project + Review

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Goal
Build a complete full stack app connecting React frontend to your Java Spring Boot backend.

---

## Project Checklist
- [ ] Project setup with Vite
- [ ] Folder structure organized
- [ ] React Router - multiple pages
- [ ] Axios - connected to Spring Boot API
- [ ] Auth - JWT login/logout with Zustand
- [ ] Protected routes
- [ ] Tailwind CSS styling
- [ ] Loading & error states
- [ ] Deployed to Vercel

---

## Suggested Project Ideas
- Employee Management System
- Task Manager / Project Tracker
- Inventory Dashboard
- Bug Tracker

---

## Folder Structure
```
src/
├── components/       # Reusable UI components
├── pages/            # Page components
├── hooks/            # Custom hooks
├── store/            # Zustand stores
├── api/              # Axios config & API calls
├── utils/            # Helper functions
└── App.jsx
```

---

## Final Review Checklist
- [ ] Day 01: JSX & Components ✅
- [ ] Day 02: Props ✅
- [ ] Day 03: useState ✅
- [ ] Day 04: Events & Forms ✅
- [ ] Day 05: useEffect ✅
- [ ] Day 06: useRef & useContext ✅
- [ ] Day 07: useReducer & Custom Hooks ✅
- [ ] Day 08: React Router ✅
- [ ] Day 09: Axios & API ✅
- [ ] Day 10: Zustand ✅
- [ ] Day 11: Tailwind CSS ✅
- [ ] Day 12: Performance ✅
- [ ] Day 13: Testing ✅
- [ ] Day 14: Advanced Patterns ✅

---

## My Notes
> Write your notes here...

---

## What I Learned
> Summary of the 15 days...

---

## Next Steps
- [ ] Learn Next.js
- [ ] Learn TypeScript + React
- [ ] Contribute to open source
- [ ] Apply for jobs 🚀

---

## Interview Questions (Full React Review)

**Q1. What is the difference between React and a framework like Angular?**
> React is a UI library focused only on the view layer. Angular is a full framework with built-in routing, forms, HTTP, and DI. React gives more flexibility but requires choosing your own libraries.

**Q2. What is the React component lifecycle?**
> Mount → Update → Unmount. In hooks: mount = `useEffect(fn, [])`, update = `useEffect(fn, [dep])`, unmount = cleanup function returned from useEffect.

**Q3. What is the difference between client-side and server-side rendering?**
> CSR (React default): browser downloads JS and renders the page. SSR (Next.js): server renders HTML and sends it to the browser. SSR is faster for first load and better for SEO.

**Q4. How does React handle keys in lists and why are they important?**
> Keys help React identify which items changed, were added, or removed. Without keys, React re-renders the entire list. Keys must be unique among siblings. Avoid using array index as key when the list can change.

**Q5. What is the difference between useEffect and useLayoutEffect?**
> `useEffect` runs after the browser paints. `useLayoutEffect` runs synchronously after DOM mutations but before the browser paints. Use useLayoutEffect only when you need to measure or mutate the DOM before the user sees it.

**Q6. What is React Strict Mode?**
> A development tool that highlights potential problems. It double-invokes certain functions (like render and useEffect) to detect side effects. Has no effect in production.

**Q7. How do you optimize a React app for production?**
> - Code splitting with React.lazy
> - Memoization with React.memo, useMemo, useCallback
> - Avoid unnecessary re-renders
> - Use production build (`npm run build`)
> - Lazy load images
> - Use a CDN

**Q8. What is the difference between React and Next.js?**
> React is a UI library. Next.js is a framework built on top of React that adds SSR, SSG, file-based routing, API routes, and image optimization out of the box.

**Q9. How do you share logic between components in React?**
> Three ways: (1) Custom hooks for stateful logic, (2) HOCs for component-level enhancements, (3) Context API or Zustand for shared state.

**Q10. What would you do if a React app is slow?**
> Profile with React DevTools Profiler → identify components that re-render too often → apply React.memo, useMemo, useCallback → check for unnecessary state updates → implement code splitting.
