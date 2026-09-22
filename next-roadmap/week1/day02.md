# Day 02 — App Router, Layouts & Pages

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### The App Router (Next.js 13+)

The App Router is the **modern, recommended** way to build Next.js apps. It replaced the old Pages Router (`pages/` directory). Key differences:

| Feature | Pages Router | App Router |
|---------|-------------|------------|
| Directory | `pages/` | `app/` |
| Layouts | `_app.js` | `layout.jsx` per folder |
| Data fetching | `getServerSideProps` | `async` components |
| Default rendering | Client-side | Server-side |
| Nested layouts | Hard | Built-in |

---

### Special Files in App Router

Next.js has reserved file names inside each route folder:

| File | Purpose |
|------|---------|
| `page.jsx` | The UI for that route (makes it publicly accessible) |
| `layout.jsx` | Wraps the page and persists across navigation |
| `loading.jsx` | Shown while page is loading (auto Suspense) |
| `error.jsx` | Shown when an error is thrown |
| `not-found.jsx` | Shown for 404 errors |
| `route.js` | API endpoint (no UI) |

---

### Layouts

Layouts wrap your pages. They **do not re-render** when navigating between child pages — great for Navbars, sidebars, footers.

```jsx
// app/layout.jsx  ← Root layout (required)
import './globals.css';

export const metadata = {
  title: 'My App',
  description: 'Built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>My Navbar</header>
        <main>{children}</main>
        <footer>My Footer</footer>
      </body>
    </html>
  );
}
```

`{children}` is where the current page renders.

---

### Nested Layouts

You can have a layout for a specific section of your app:

```
app/
├── layout.jsx          ← wraps everything
├── page.jsx            ← /
└── dashboard/
    ├── layout.jsx      ← wraps only dashboard pages
    ├── page.jsx        ← /dashboard
    └── settings/
        └── page.jsx    ← /dashboard/settings
```

```jsx
// app/dashboard/layout.jsx
export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <aside>
        <p>Sidebar</p>
      </aside>
      <section>{children}</section>
    </div>
  );
}
```

---

### Loading UI

Create `loading.jsx` next to your `page.jsx` — Next.js automatically wraps the page in a `<Suspense>` boundary:

```jsx
// app/dashboard/loading.jsx
export default function Loading() {
  return <p>Loading dashboard...</p>;
}
```

---

### Error Handling

Create `error.jsx` to catch errors in a route segment:

```jsx
// app/dashboard/error.jsx
'use client'; // error components must be Client Components

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

### Not Found Page

```jsx
// app/not-found.jsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
```

You can also trigger it programmatically:

```jsx
import { notFound } from 'next/navigation';

export default function UserPage({ params }) {
  const user = getUserById(params.id);
  if (!user) notFound(); // triggers not-found.jsx
  return <div>{user.name}</div>;
}
```

---

### Route Groups

You can group routes without affecting the URL using `(folderName)` syntax:

```
app/
├── (marketing)/
│   ├── page.jsx        → /
│   └── about/
│       └── page.jsx    → /about
└── (app)/
    ├── layout.jsx      ← layout only for app routes
    └── dashboard/
        └── page.jsx    → /dashboard
```

Route groups are useful for applying different layouts to different sections.

---

### `template.jsx` — Re-renders on Every Navigation

`layout.jsx` **does not re-render** between child routes. If you need a wrapper that **does** re-render (e.g. a page-transition animation, or resetting a tab component on every navigation), use `template.jsx` instead:

```
app/
└── dashboard/
    ├── layout.jsx    ← persists, never re-renders
    ├── template.jsx  ← re-mounts on every navigation
    └── page.jsx
```

```jsx
// app/dashboard/template.jsx
export default function DashboardTemplate({ children }) {
  // This component re-mounts every time the user navigates
  // between dashboard sub-pages — unlike layout.jsx
  return <div className="page-fade-in">{children}</div>;
}
```

Use `layout` by default. Only reach for `template` when you explicitly need the re-mount behaviour.

---

### `default.jsx` — Parallel Route Fallback

When using parallel routes (`@slot` folders), `default.jsx` is shown as a fallback when Next.js can't match an active state for a slot (e.g. on a hard refresh). Without it, you get a 404. This is covered in depth on Day 14.

---

### Dynamic Metadata with `generateMetadata`

For pages where the title depends on fetched data, use `generateMetadata` instead of a static export:

```jsx
// app/blog/[slug]/page.jsx

export async function generateMetadata({ params }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`)
    .then(r => r.json());

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPost({ params }) {
  // fetch is deduplicated — same call above is NOT made twice
  const post = await fetch(`https://api.example.com/posts/${params.slug}`)
    .then(r => r.json());
  return <article>{post.content}</article>;
}
```

`generateMetadata` is async and runs on the server. Next.js waits for it to resolve before sending the `<head>` to the client.

---

### Metadata

Export a `metadata` object from any `page.jsx` or `layout.jsx` for static values:

```jsx
// app/about/page.jsx
export const metadata = {
  title: 'About Us',
  description: 'Learn more about our team',
};

export default function AboutPage() {
  return <h1>About Us</h1>;
}
```

---

## 💻 Practical Task

**Build a Dashboard app with nested layouts:**

1. Create a new Next.js app: `npx create-next-app@latest day02-practice`
2. Build this structure:
   - `/` — Public home page
   - `/dashboard` — Dashboard home (with a sidebar layout)
   - `/dashboard/profile` — User profile page
   - `/dashboard/settings` — Settings page
3. The dashboard layout must include a sidebar with links to Profile and Settings
4. Add a `loading.jsx` inside `/dashboard`
5. Add a `not-found.jsx` at the root level
6. Add proper `metadata` to each page

---

## ✅ End-of-Day Quiz

**Q1.** What is the difference between `layout.jsx` and `page.jsx`?

**Q2.** How do you create a loading screen for a specific route in Next.js?

**Q3.** What does `(marketing)` folder name syntax do in the App Router?

**Q4.** Where should error.jsx components be marked — server or client? Why?

**Q5.** What happens to the layout when you navigate from `/dashboard` to `/dashboard/settings`?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** `layout.jsx` wraps and persists across navigations — it doesn't re-render. `page.jsx` is the actual page content that changes per route.

**A2.** Create a `loading.jsx` file in the same folder as `page.jsx`. Next.js automatically wraps the page in a Suspense boundary.

**A3.** Route Groups (`(folder)`) organize routes without adding to the URL path. It helps apply different layouts to different sections.

**A4.** `error.jsx` must be a Client Component (`'use client'`) because it uses event handlers like the `reset()` function and React error boundaries.

**A5.** The layout does NOT re-render — it stays mounted. Only the `{children}` (the page content) changes. This is why layouts are great for persistent UI like sidebars.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
