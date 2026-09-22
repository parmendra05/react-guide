# Day 09 — State Management & React Query

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### State in Next.js — The Mental Model

Next.js has two worlds. Choose your state tool based on which world the data lives in:

| Data type | Where it lives | Tool |
|-----------|---------------|------|
| Server data (API, DB) | Server + client cache | React Query / SWR |
| Global UI state (theme, sidebar open) | Client only | Zustand / Context |
| Form state | Client only | React Hook Form |
| URL state (filters, pagination) | URL | `useSearchParams` |
| Simple local state | Component | `useState` |

---

### When NOT to Use Global State

In Next.js, many things that used to need Redux or Context are now solved by:
- **Server Components** — fetch data directly, no state needed
- **URL params** — shareable, bookmarkable state
- **Server Actions** — mutations without client state

Only reach for a global state store when you genuinely have **shared client-side UI state** (e.g. a shopping cart, a theme toggle, a notification system).

---

### React Query (TanStack Query)

React Query is the gold standard for **server state** on the client side. It handles caching, background refetching, loading/error states, and pagination automatically.

#### Install

```bash
npm install @tanstack/react-query
npm install @tanstack/react-query-devtools
```

#### Set up the Provider

```jsx
// app/providers.jsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function Providers({ children }) {
  // Create a new QueryClient per session (not a module-level singleton)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute before data is considered stale
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

```jsx
// app/layout.jsx
import Providers from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

#### `useQuery` — Fetching Data

```jsx
'use client';

import { useQuery } from '@tanstack/react-query';

async function fetchPosts() {
  const res = await fetch('/api/posts');
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default function PostsList() {
  const {
    data: posts,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['posts'],       // unique cache key
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
        </div>
      ))}
    </div>
  );
}
```

---

#### `useMutation` — Creating / Updating / Deleting

```jsx
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

async function createPost(newPost) {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  });
  return res.json();
}

export default function CreatePostForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      // Invalidate and refetch posts after a successful mutation
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title: 'New Post', body: 'Content here' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
    </form>
  );
}
```

---

#### Dependent Queries

```jsx
// Only fetch user posts AFTER the user has been fetched
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

const { data: posts } = useQuery({
  queryKey: ['posts', user?.id],
  queryFn: () => fetchUserPosts(user.id),
  enabled: !!user, // ← only runs when user is truthy
});
```

---

### Zustand — Global UI State

Zustand is a tiny, simple state management library for client-side UI state.

```bash
npm install zustand
```

```js
// store/useCartStore.js
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],

  addItem: (product) => set((state) => ({
    items: [...state.items, product],
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
  })),

  clearCart: () => set({ items: [] }),

  // Computed value
  totalItems: () => get().items.length,
  totalPrice: () => get().items.reduce((sum, item) => sum + item.price, 0),
}));

export default useCartStore;
```

```jsx
'use client';

import useCartStore from '@/store/useCartStore';

export default function CartButton() {
  const { items, addItem, removeItem } = useCartStore();

  return (
    <div>
      <p>Cart: {items.length} items</p>
      <button onClick={() => addItem({ id: 1, name: 'Shoes', price: 99 })}>
        Add Shoes
      </button>
    </div>
  );
}
```

---

### URL State with `useSearchParams`

For filters, sorting, and pagination — store state in the URL so it's shareable and bookmarkable.

```jsx
'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function ProductFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const category = searchParams.get('category') || 'all';

  const setCategory = (value) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div>
      {['all', 'electronics', 'clothing', 'books'].map(cat => (
        <button
          key={cat}
          onClick={() => setCategory(cat)}
          style={{ fontWeight: category === cat ? 'bold' : 'normal' }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
```

---

### Hydration Warning — Common Pitfall

When your Client Component reads from `localStorage` or `window` on initial render, you may get a hydration mismatch (server HTML ≠ client HTML).

```jsx
'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light'); // always start with default
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read localStorage only on the client, after mount
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    setMounted(true);
  }, []);

  // Avoid rendering until client-side hydration is complete
  if (!mounted) return null;

  return (
    <button onClick={() => {
      const next = theme === 'light' ? 'dark' : 'light';
      setTheme(next);
      localStorage.setItem('theme', next);
    }}>
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
```

---

### Zustand `persist` Middleware

Persist Zustand store to `localStorage` automatically so state survives page refreshes:

```js
// store/useCartStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => set((state) => ({
        items: [...state.items, product],
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id),
      })),
      clearCart: () => set({ items: [] }),
      totalPrice: () => get().items.reduce((sum, item) => sum + item.price, 0),
    }),
    {
      name: 'cart-storage', // localStorage key
      // partialize: (state) => ({ items: state.items }), // only persist items
    }
  )
);

export default useCartStore;
```

> ⚠️ Use the `mounted` pattern (above) when reading persisted state to avoid hydration mismatches — the server doesn't have access to `localStorage`.

---

### `useInfiniteQuery` — Pagination & Infinite Scroll

```jsx
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useCallback } from 'react';

async function fetchPosts({ pageParam = 1 }) {
  const res = await fetch(`/api/posts?page=${pageParam}&limit=10`);
  return res.json(); // { posts: [...], nextPage: 2 | null }
}

export default function InfinitePostsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
  });

  // Intersection Observer for auto-loading
  const observerRef = useRef();
  const lastPostRef = useCallback((node) => {
    if (isFetchingNextPage) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  if (isLoading) return <p>Loading...</p>;

  const allPosts = data.pages.flatMap(page => page.posts);

  return (
    <div>
      {allPosts.map((post, index) => (
        <div
          key={post.id}
          ref={index === allPosts.length - 1 ? lastPostRef : null}
        >
          <h2>{post.title}</h2>
        </div>
      ))}
      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p>No more posts.</p>}
    </div>
  );
}
```

---

### React Context for Theme / Auth (Client Tree)

When you need shared client-side state that doesn't belong in Zustand (e.g., a theme or auth context that wraps a section), use React Context — but only in Client Component trees:

```jsx
// context/ThemeContext.jsx
'use client';

import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
```

```jsx
// app/layout.jsx — Server Component wrapping a Client Provider
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**Zustand vs Context:**
- Use **Context** for simple, low-frequency updates (theme, locale, auth user object)
- Use **Zustand** for complex or high-frequency state (shopping cart, notifications, multi-step forms)

---

## 💻 Practical Task

**Build a product store with cart:**

1. Set up React Query with a `Providers` wrapper in the root layout
2. Create `app/shop/page.jsx` (Client Component) — fetch products using `useQuery`
3. Create a `useCartStore` with Zustand — `addItem`, `removeItem`, `items`
4. Each product card has an "Add to Cart" button that calls `useCartStore`
5. Create a `CartSidebar` component that reads from the store and shows item count
6. Add URL filter functionality — filter by category using `useSearchParams`

---

## ✅ End-of-Day Quiz

**Q1.** What is the difference between "server state" and "UI state"?

**Q2.** What does `queryKey` do in React Query?

**Q3.** How do you refetch data after a mutation in React Query?

**Q4.** When should you use Zustand instead of React Query?

**Q5.** What is `staleTime` in React Query?

**Q6.** Why is storing filter state in the URL better than in `useState`?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** Server state is data that lives on a server (API responses, database records) that you fetch, cache, and sync. UI state is local client-only state like whether a modal is open or what theme is selected. They need different tools.

**A2.** `queryKey` is a unique identifier for a cached query result. React Query uses it to store, retrieve, and invalidate cached data. Queries with the same key share the same cache entry.

**A3.** Call `queryClient.invalidateQueries({ queryKey: ['your-key'] })` inside the `onSuccess` callback of `useMutation`. This marks the cache as stale and triggers a background refetch.

**A4.** Zustand is for client-only UI state that doesn't come from a server — shopping carts, theme toggles, sidebar open/closed, notification queues. React Query is for server-fetched data that needs caching and syncing.

**A5.** `staleTime` defines how long fetched data is considered "fresh." During this window, React Query won't refetch data even if the component re-mounts or the window refocuses. After the time passes, data is "stale" and will be refetched in the background on next access.

**A6.** URL state survives page refresh, is shareable via link, supports browser back/forward navigation, and doesn't cause hydration mismatches. `useState` for filters means the state is lost on refresh and cannot be shared.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
