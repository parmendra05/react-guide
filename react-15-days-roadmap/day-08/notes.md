# Day 08 - React Router v6

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] Setup React Router
- [ ] BrowserRouter, Routes, Route
- [ ] Link & NavLink
- [ ] useNavigate
- [ ] useParams (dynamic routes)
- [ ] Protected Routes
- [ ] 404 Page

---

## Key Concepts
```jsx
// Setup
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// Routes
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/user/:id" element={<User />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

// Dynamic param
const { id } = useParams();

// Navigate
const navigate = useNavigate();
navigate('/about');
```

---

## Practice Task
- [ ] Create 3 pages: Home, About, Users
- [ ] Add navigation between pages
- [ ] Create a dynamic user detail page /users/:id
- [ ] Add a 404 page

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://reactrouter.com/en/main

---

## Interview Questions

**Q1. What is React Router and why do we need it?**
> React Router is a library for client-side routing in React apps. Since React is a SPA (Single Page Application), React Router handles navigation between views without full page reloads.

**Q2. What is the difference between Link and a regular anchor tag?**
> A regular `<a>` tag causes a full page reload. `<Link>` from React Router navigates without reloading, keeping the app state intact and making navigation faster.

**Q3. What is the difference between Link and NavLink?**
> NavLink is like Link but automatically adds an `active` class when the route matches. Useful for styling active navigation items.

**Q4. How do you pass data between routes?**
> Three ways: (1) URL params `/user/:id`, (2) query strings `?tab=profile`, (3) state via navigate: `navigate('/page', { state: { data } })` and read with `useLocation()`.

**Q5. What are protected routes?**
> Routes that require authentication to access. If the user is not logged in, they are redirected to the login page. Implemented by wrapping routes with an auth check component.

**Q6. What is the difference between useNavigate and Redirect?**
> `useNavigate` is the modern hook in React Router v6 for programmatic navigation. `Redirect` was used in v5. In v6, use `<Navigate>` component or `useNavigate()` hook.
