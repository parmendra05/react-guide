# Day 10 - State Management (Zustand)

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] Why global state management
- [ ] Context API limitations
- [ ] Zustand setup
- [ ] Create a store
- [ ] Read from store
- [ ] Update store
- [ ] Persist state (localStorage)

---

## Key Concepts
```jsx
import { create } from 'zustand';

// Create store
const useStore = create((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));

// Use in component
function Profile() {
  const { user, logout } = useStore();
  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## Practice Task
- [ ] Create an auth store (user, token, login, logout)
- [ ] Create a cart store (items, addItem, removeItem, total)
- [ ] Use the store across multiple components

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://zustand-demo.pmnd.rs/

---

## Interview Questions

**Q1. What is the problem with Context API for state management?**
> Context API re-renders all consumers when the value changes, even if they only use part of the state. It also has no built-in devtools or middleware support, making it hard to scale.

**Q2. What is Zustand?**
> Zustand is a lightweight state management library. It uses a simple store with hooks, has no boilerplate, and only re-renders components that use the specific state that changed.

**Q3. What is the difference between Zustand and Redux?**
> Zustand is much simpler — no actions, reducers, or dispatchers needed. Redux is more structured and better for very large apps with complex state. Zustand is preferred for most modern React apps.

**Q4. When should you use global state vs local state?**
> Use local state (useState) for UI-specific data like form inputs or toggles. Use global state for data shared across many components like auth user, cart, or theme.

**Q5. What is Redux Toolkit?**
> Redux Toolkit is the modern, simplified way to use Redux. It reduces boilerplate with createSlice and configureStore. Still more complex than Zustand but good for large enterprise apps.

**Q6. How do you persist Zustand state across page refresh?**
> Use the `persist` middleware from Zustand:
> ```js
> import { persist } from 'zustand/middleware';
> const useStore = create(persist((set) => ({ user: null }), { name: 'auth-store' }));
> ```
