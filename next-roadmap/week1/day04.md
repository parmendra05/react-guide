# Day 04 — Data Fetching Strategies

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### The 4 Rendering Strategies in Next.js

Next.js gives you control over **when** data is fetched and **when** HTML is generated.

| Strategy | When HTML is built | Data freshness | Use case |
|----------|--------------------|----------------|----------|
| **SSG** — Static Site Generation | At build time | Stale until rebuild | Blogs, docs, marketing pages |
| **SSR** — Server-Side Rendering | On every request | Always fresh | Dashboards, user-specific pages |
| **ISR** — Incremental Static Regen | At build + revalidate interval | Periodically fresh | News feeds, product pages |
| **CSR** — Client-Side Rendering | In the browser | On demand | Private data, after auth |

---

### 1. Static Site Generation (SSG) — Default

In the App Router, if you `fetch` without any options inside a Server Component, it's **cached by default** (equivalent to old `getStaticProps`).

```jsx
// app/posts/page.jsx
// This page is statically generated at build time

async function getPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  // No cache option = cached forever (SSG behavior)
  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <ul>
      {posts.slice(0, 10).map(post => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}
```

---

### 2. Server-Side Rendering (SSR)

Use `cache: 'no-store'` to fetch fresh data on every request (equivalent to old `getServerSideProps`):

```jsx
// app/dashboard/page.jsx
// This page re-fetches on every request (SSR)

async function getOrders() {
  const res = await fetch('https://api.example.com/orders', {
    cache: 'no-store', // ← never cache, always fetch fresh
  });
  return res.json();
}

export default async function DashboardPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1>Live Orders</h1>
      {orders.map(order => (
        <p key={order.id}>{order.name} — {order.status}</p>
      ))}
    </div>
  );
}
```

---

### 3. Incremental Static Regeneration (ISR)

Use `next: { revalidate: N }` to regenerate the page every N seconds:

```jsx
// app/products/page.jsx
// Rebuilds every 60 seconds in background (ISR)

async function getProducts() {
  const res = await fetch('https://fakestoreapi.com/products', {
    next: { revalidate: 60 }, // ← regenerate every 60 seconds
  });
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>${p.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 4. On-Demand Revalidation

Manually trigger a revalidation instead of waiting for the time interval:

```js
// app/api/revalidate/route.js
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  revalidatePath('/products');        // revalidate a specific path
  // revalidateTag('products-list'); // or revalidate by tag
  return Response.json({ revalidated: true });
}
```

Tag your fetch calls so you can revalidate them by name:

```jsx
const res = await fetch('https://api.example.com/products', {
  next: { tags: ['products-list'] }
});
```

---

### 5. Client-Side Rendering (CSR)

For data that should only load in the browser (private, after-auth, or highly dynamic):

```jsx
'use client';

import { useState, useEffect } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  return <h1>Hello, {user.name}</h1>;
}
```

> **Tip:** For CSR data fetching, prefer React Query or SWR over raw `useEffect` (covered on Day 09).

---

### Fetch Cache Options — Full Reference

```js
// SSG — cached forever until redeployed or manually revalidated
fetch(url, { cache: 'force-cache' });   // same as omitting cache option

// SSR — never cache, always fresh on every request
fetch(url, { cache: 'no-store' });

// ISR — time-based revalidation
fetch(url, { next: { revalidate: 60 } });

// Tag-based revalidation — clear with revalidateTag('tag-name')
fetch(url, { next: { tags: ['products'] } });
```

---

### `cookies()` and `headers()` — Dynamic Rendering Triggers

Reading cookies or request headers inside a Server Component **opts the entire page into dynamic rendering** (SSR). Import them from `next/headers`:

```jsx
import { cookies, headers } from 'next/headers';

export default function ProfilePage() {
  const cookieStore = cookies();
  const theme = cookieStore.get('theme')?.value ?? 'light';

  const headersList = headers();
  const userAgent = headersList.get('user-agent');

  return (
    <div data-theme={theme}>
      <p>Your browser: {userAgent}</p>
    </div>
  );
}
```

> Any Server Component that calls `cookies()` or `headers()` is automatically dynamic (SSR), even if you don't set `cache: 'no-store'`.

---

### Page-Level Cache Config

Instead of setting cache options per-fetch, you can set the whole page's behaviour with exports:

```jsx
// app/dashboard/page.jsx

// Force the entire route to be dynamic (SSR)
export const dynamic = 'force-dynamic';

// Or: force it to be static
// export const dynamic = 'force-static';

// Or: set a default revalidate time for all fetches on this page
export const revalidate = 60; // same as ISR revalidate: 60 on every fetch

export default async function DashboardPage() {
  const data = await fetch('https://api.example.com/data').then(r => r.json());
  return <div>{data.title}</div>;
}
```

| Export | Effect |
|--------|--------|
| `export const dynamic = 'force-dynamic'` | Always SSR, equivalent to `cache: 'no-store'` on every fetch |
| `export const dynamic = 'force-static'` | Always SSG, ignores dynamic functions |
| `export const revalidate = N` | Sets ISR interval for all fetches on the page |
| `export const revalidate = 0` | Equivalent to `force-dynamic` |

---

### Fetch Deduplication

Next.js automatically **deduplicates** identical fetch requests made in the same render pass. If multiple components fetch the same URL, it's only fetched once.

```jsx
// Both of these in the same render pass make ONE request
await fetch('https://api.example.com/user');
await fetch('https://api.example.com/user'); // deduplicated ✅
```

---

### Parallel vs Sequential Data Fetching

**Sequential (slower — avoid when possible):**
```jsx
// Each await blocks the next one
const user = await getUser();
const posts = await getUserPosts(user.id); // waits for user first
```

**Parallel (faster):**
```jsx
// Both fetch at the same time
const [user, posts] = await Promise.all([
  getUser(),
  getPosts(),
]);
```

---

### `generateStaticParams` — Dynamic SSG

For dynamic routes like `/blog/[slug]`, tell Next.js which pages to pre-build:

```jsx
// app/blog/[slug]/page.jsx

export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  return posts.map(post => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`).then(r => r.json());
  return <article>{post.content}</article>;
}
```

---

## 💻 Practical Task

**Build a news feed with multiple fetching strategies:**

1. Create `app/news/page.jsx` — fetch articles with `revalidate: 30` (ISR)
2. Create `app/news/live/page.jsx` — fetch "breaking news" with `cache: 'no-store'` (SSR)
3. Create `app/news/[id]/page.jsx` — a dynamic page with `generateStaticParams` for the first 5 articles
4. Add a loading state using `loading.jsx`
5. Log to the terminal when each fetch runs — notice SSR logs on every visit, SSG only on build

---

## ✅ End-of-Day Quiz

**Q1.** What is the default caching behavior of `fetch` in Next.js Server Components?

**Q2.** How do you make a page re-fetch data on every request?

**Q3.** What does `next: { revalidate: 60 }` mean?

**Q4.** What is the difference between SSG and ISR?

**Q5.** When should you use CSR instead of SSR?

**Q6.** What does `Promise.all()` help with in data fetching?

**Q7.** What does calling `cookies()` inside a Server Component do to its rendering mode?

**Q8.** How do you force an entire page to always render dynamically without touching each `fetch` call?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** By default, `fetch` in Next.js Server Components is cached (SSG behavior) — the result is stored and reused across requests until you opt out.

**A2.** Pass `cache: 'no-store'` to the fetch call: `fetch(url, { cache: 'no-store' })`.

**A3.** It uses ISR — the page is statically generated, but Next.js regenerates it in the background every 60 seconds if there's a request after the interval.

**A4.** SSG builds the page once at build time. ISR also builds at build time, but then automatically re-builds it at a defined interval without a full redeployment.

**A5.** CSR is best for data that is private (behind auth), highly personalized (like a shopping cart), or where SEO doesn't matter. It moves the data fetching burden to the browser.

**A6.** `Promise.all()` lets you fetch multiple independent data sources simultaneously instead of sequentially. This significantly reduces total wait time.

**A7.** Calling `cookies()` or `headers()` automatically forces the route into dynamic (SSR) rendering — Next.js can't statically pre-render because the output depends on the incoming request.

**A8.** Add `export const dynamic = 'force-dynamic'` at the top of the page file. This is equivalent to setting `cache: 'no-store'` on every fetch in that page.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
