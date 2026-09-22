# Day 11 — Caching & Performance

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### Next.js Caching — The Four Layers

Next.js has a multi-layered caching system. Understanding all four is the key to mastering performance.

| Cache | What it stores | Where | Duration |
|-------|---------------|-------|----------|
| **Request Memoization** | `fetch` results during a single render | Server (in-memory) | One request lifetime |
| **Data Cache** | `fetch` results persisted to disk | Server (filesystem) | Until revalidated / forever |
| **Full Route Cache** | Rendered HTML + RSC payload | Server (filesystem) | Until revalidated |
| **Router Cache** | RSC payload | Client (memory) | 30s (dynamic) / 5min (static) |

---

### 1. Request Memoization

If multiple Server Components in the same render tree call the same `fetch`, Next.js only makes **one** network request. The result is shared automatically.

```jsx
// UserAvatar.jsx — Server Component
async function getUser(id) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// UserCard.jsx — Server Component
async function getUser(id) {
  return fetch(`/api/users/${id}`).then(r => r.json()); // same URL
}

// Even though both call the same URL, fetch is only made ONCE per render
```

This only applies to `GET` requests with identical URLs and options.

---

### 2. Data Cache

This is the persistent, disk-level cache for `fetch` responses.

```js
// FORCE CACHE — cached forever until manually revalidated
fetch(url, { cache: 'force-cache' });

// NO STORE — never cache (SSR, always fresh)
fetch(url, { cache: 'no-store' });

// TIME-BASED REVALIDATION — rebuild cache every N seconds (ISR)
fetch(url, { next: { revalidate: 60 } });

// TAG-BASED REVALIDATION — cache until you call revalidateTag()
fetch(url, { next: { tags: ['user-list'] } });
```

---

### 3. On-Demand Revalidation

Manually clear the cache when data changes (e.g., after a CMS webhook):

```js
// app/api/revalidate/route.js
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { path, tag, secret } = await request.json();

  // Protect the endpoint with a secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (tag) revalidateTag(tag);
  if (path) revalidatePath(path);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

---

### 4. Router Cache (Client-Side)

The browser caches visited pages in memory. When you navigate back, the page loads instantly without a server request. This cache auto-expires:
- Dynamic routes: **30 seconds**
- Static routes: **5 minutes**

To force a fresh fetch after a mutation, call `router.refresh()`:

```jsx
'use client';

import { useRouter } from 'next/navigation';

export default function DeleteButton({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    router.refresh(); // clears Router Cache and re-fetches current page data
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

---

### `unstable_cache` — Cache Non-Fetch Functions

Cache the result of any async function (e.g., a direct DB call) — not just `fetch`:

```js
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/db';

const getCachedPosts = unstable_cache(
  async () => {
    return db.posts.findMany({ orderBy: { createdAt: 'desc' } });
  },
  ['all-posts'],          // cache key
  {
    revalidate: 60,       // revalidate every 60s
    tags: ['posts'],      // or revalidate by tag
  }
);

// Use it in a Server Component:
const posts = await getCachedPosts();
```

---

### `next/script` Loading Strategies

Never put third-party `<script>` tags directly in your layout. Use `next/script` for proper loading control:

```jsx
// app/layout.jsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Loads after page becomes interactive — best for analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
          strategy="afterInteractive"
        />

        {/* Chat widget — load during browser idle time */}
        <Script
          src="https://cdn.intercom.io/widget.js"
          strategy="lazyOnload"
          onLoad={() => console.log('Chat widget loaded')}
        />
      </body>
    </html>
  );
}
```

| Strategy | When it loads | Use for |
|----------|--------------|---------|
| `beforeInteractive` | Before page hydration | Critical polyfills only |
| `afterInteractive` | After page is interactive | Analytics, tag managers |
| `lazyOnload` | During browser idle time | Chat widgets, low-priority |
| `worker` (experimental) | In a web worker | Heavy computation |

> Never put a `<script>` tag inside a `<head>` manually in Next.js — it bypasses these optimisations and blocks rendering.

---

### Skeleton Loaders Pattern

A skeleton is a placeholder that matches the shape of the real content. Always build skeletons to pair with your `loading.jsx` files:

```jsx
// components/skeletons/PostCardSkeleton.jsx
export default function PostCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-48 w-full mb-4" />
      <div className="bg-gray-200 rounded h-4 w-3/4 mb-2" />
      <div className="bg-gray-200 rounded h-4 w-1/2" />
    </div>
  );
}

// components/skeletons/PostListSkeleton.jsx
import PostCardSkeleton from './PostCardSkeleton';

export default function PostListSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
```

```jsx
// app/blog/loading.jsx — automatically shown while page.jsx is streaming
import PostListSkeleton from '@/components/skeletons/PostListSkeleton';

export default function Loading() {
  return <PostListSkeleton />;
}
```

```jsx
// Fine-grained Suspense with skeleton inside a page
import { Suspense } from 'react';
import PostListSkeleton from '@/components/skeletons/PostListSkeleton';
import PostList from '@/components/PostList';

export default function BlogPage() {
  return (
    <main>
      <h1>Blog</h1>
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
    </main>
  );
}
```

---

### `preconnect` and `dns-prefetch` via Metadata

Speed up third-party requests by pre-establishing connections early:

```jsx
// app/layout.jsx
export const metadata = {
  // These generate <link> tags in <head> automatically
  other: {
    // preconnect: establishes full TCP+TLS connection early
    // dns-prefetch: resolves DNS only (lighter, use for less critical origins)
  },
};

// Or add them manually via the viewport / icons fields in metadata
// For direct link tag control, use the `links` field:
export const metadata = {
  title: 'My App',
  // Next.js renders these as <link> tags in <head>
  alternates: {
    canonical: 'https://myapp.com',
  },
};
```

For `preconnect` and `dns-prefetch`, add them directly in the root layout's `<head>` via the metadata `links` — or more practically, directly in `app/layout.jsx`:

```jsx
// app/layout.jsx — direct <link> approach inside RootLayout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://cdn.example.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

> When using `next/font`, font preconnects are added automatically — you don't need to add them manually.

---

### Performance Optimization Techniques

#### Code Splitting & Lazy Loading

Next.js splits your code per route automatically. For large components you can defer them further:

```jsx
import dynamic from 'next/dynamic';

// Only loads this component when it enters the viewport
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // don't render on server (for browser-only libraries)
});

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart /> {/* loaded lazily */}
    </div>
  );
}
```

---

#### Streaming with Suspense

Stream parts of the page to the browser as they're ready — users see content faster:

```jsx
// app/dashboard/page.jsx
import { Suspense } from 'react';
import RevenueChart from '@/components/RevenueChart';
import LatestOrders from '@/components/LatestOrders';
import StatsSkeleton from '@/components/skeletons/StatsSkeleton';

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>

      {/* These two components stream in independently */}
      <Suspense fallback={<StatsSkeleton />}>
        <RevenueChart />   {/* slow DB query */}
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <LatestOrders />   {/* different slow query */}
      </Suspense>
    </main>
  );
}
```

Without Suspense, both slow queries block the entire page. With Suspense, each streams in as soon as it's ready.

---

#### Parallel Routes for Dashboard Layouts

```
app/
└── dashboard/
    ├── layout.jsx
    ├── page.jsx
    ├── @analytics/
    │   └── page.jsx   ← rendered in @analytics slot
    └── @team/
        └── page.jsx   ← rendered in @team slot
```

```jsx
// app/dashboard/layout.jsx
export default function DashboardLayout({ children, analytics, team }) {
  return (
    <div>
      {children}
      <div className="grid grid-cols-2 gap-4">
        {analytics}
        {team}
      </div>
    </div>
  );
}
```

Each slot fetches data independently — one slow slot doesn't block the others.

---

#### `generateMetadata` for Dynamic Pages

Avoids extra fetches by sharing the data fetch between metadata and the page:

```jsx
// app/blog/[slug]/page.jsx

async function getPost(slug) {
  return fetch(`/api/posts/${slug}`, { next: { revalidate: 3600 } }).then(r => r.json());
}

// This function and the page component share the same cached fetch
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }) {
  const post = await getPost(params.slug); // uses the same cache hit!
  return <article>{post.content}</article>;
}
```

---

### Core Web Vitals — What to Optimize

| Metric | Measures | Target |
|--------|----------|--------|
| **LCP** — Largest Contentful Paint | Load time of the main content | < 2.5s |
| **FID** / **INP** — Interaction to Next Paint | Time to respond to first input | < 200ms |
| **CLS** — Cumulative Layout Shift | Visual stability (no jumping elements) | < 0.1 |

**LCP tips:** Add `priority` to hero images, use SSG/ISR, minimize render-blocking resources.
**CLS tips:** Always set `width` and `height` on images, reserve space for dynamic content.
**INP tips:** Avoid heavy JS on the main thread, use Server Components to ship less JS.

---

## 💻 Practical Task

**Optimize a slow dashboard page:**

1. Create a dashboard with 3 data-heavy components (Revenue, Orders, Users)
2. Each component does a slow `fetch` with a 1-2 second artificial delay
3. First: put them all inline — notice the entire page is blocked
4. Then: wrap each in `<Suspense>` with a skeleton — notice they stream independently
5. Add `dynamic(() => import(...), { ssr: false })` to a chart library component
6. Add `next: { tags: ['dashboard'] }` to fetches and create an API route to revalidate the tag

---

## ✅ End-of-Day Quiz

**Q1.** What are the four caching layers in Next.js?

**Q2.** What is the difference between `revalidatePath` and `revalidateTag`?

**Q3.** What does `router.refresh()` do?

**Q4.** What is the benefit of wrapping Server Components in `<Suspense>`?

**Q5.** When should you use `dynamic(() => import(...), { ssr: false })`?

**Q6.** What does `unstable_cache` do and why would you use it over `fetch` caching?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** Request Memoization (per-render, in-memory deduplication), Data Cache (persistent fetch cache on disk), Full Route Cache (rendered HTML on disk), and Router Cache (client-side in-memory page cache).

**A2.** `revalidatePath('/path')` purges the cache for one specific URL. `revalidateTag('tag')` purges all cached fetches that were tagged with that label — useful when one action affects data shown on multiple pages.

**A3.** `router.refresh()` clears the client-side Router Cache for the current page and triggers a re-fetch of its Server Component data from the server, without a full page reload.

**A4.** Each `<Suspense>` boundary allows that segment to stream to the browser independently. Slow data fetches no longer block the rest of the page — users see a skeleton immediately and content pops in as data arrives.

**A5.** Use `ssr: false` for browser-only libraries (chart.js, WebGL, libraries that access `window` or `document`) that will throw errors if rendered on the server.

**A6.** `unstable_cache` caches the result of **any** async function, not just `fetch`. This is essential when querying a database directly (e.g., with Prisma or Drizzle) without going through an HTTP endpoint — you get all the same ISR/tag-based revalidation features.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
