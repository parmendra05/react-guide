# Day 01 — Setup, Introduction & File-based Routing

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🗺️ Today's Agenda

Spend about 2-3 hours on this session. Do not move to the next step until the
checkpoint for the current step works.

| Step | Time | Focus | Checkpoint |
|------|------|-------|------------|
| 1 | 10 min | Confirm prerequisites and define the goal | Node and npm versions are available |
| 2 | 20 min | Understand what Next.js adds to React | Explain the request-to-page flow in your own words |
| 3 | 20 min | Learn the App Router mental model | Map folders and files to URLs |
| 4 | 15 min | Create and inspect a Next.js app | The starter app runs at `localhost:3000` |
| 5 | 30 min | Build the home, about, and contact routes | Each URL renders its own page |
| 6 | 20 min | Add shared navigation with `Link` | Navigation changes routes without a full reload |
| 7 | 20 min | Add a dynamic route and test an unknown route | `/blog/hello-next` renders its slug |
| 8 | 15 min | Complete the quiz and write notes | You can explain every file you created |

### Learning objectives

By the end of Day 01, you should be able to:

- explain the difference between React and the Next.js framework;
- describe what the App Router does with `app/` or `src/app/`;
- create static, nested, and dynamic routes from the file structure;
- choose `Link` for internal navigation and explain why;
- identify what `layout.jsx`, `page.jsx`, and `public/` are responsible for; and
- start, inspect, and stop a Next.js development server.

---

## 🧠 Concepts

### What is Next.js?

Next.js is a React framework built on top of React that adds:
- **Server-Side Rendering (SSR)** — HTML is generated on each request
- **Static Site Generation (SSG)** — HTML is pre-built at build time
- **File-based Routing** — Your folder/file structure = your URL routes
- **API Routes** — Backend endpoints inside your frontend project
- **Built-in optimizations** — Images, fonts, scripts, SEO

Next.js is a **framework**, while React is a **UI library**. React gives you
components and rendering primitives. Next.js supplies the application
structure around them: routing, server rendering, data-fetching conventions,
asset optimization, and production tooling.

The important mental model for this roadmap is:

1. A browser requests a URL such as `/about`.
2. The App Router matches that URL to folders under `app/` (or `src/app/`).
3. The matching `page.jsx` produces the route's UI.
4. Parent `layout.jsx` files wrap that page and can persist during navigation.
5. Next.js decides how the route is rendered and sends HTML plus the JavaScript
  needed for interactive Client Components.

This means a Next.js project is more than a React component tree. It is also a
URL tree and a server/client boundary.

### Next.js vs React (plain)

| Feature | React (CRA/Vite) | Next.js |
|---------|-----------------|---------|
| Routing | Manual (React Router) | File-based (automatic) |
| Rendering | Client-side only | SSR, SSG, ISR, CSR |
| API | Separate backend needed | Built-in API routes |
| SEO | Poor by default | Excellent by default |
| Image optimization | Manual | Built-in `<Image />` |
| Deployment | Any static host | Optimized for Vercel |

---

### Creating a Next.js App

```bash
npx create-next-app@latest my-app
```

You'll be asked:
- TypeScript? → No (for now, use JS)
- ESLint? → Yes
- Tailwind CSS? → Yes
- `src/` directory? → Yes
- App Router? → Yes ✅ (this is the modern approach)
- Import alias? → No (keep default)

Then:
```bash
cd my-app
npm run dev
```

Open: http://localhost:3000

---

### Project Structure

```
my-app/
├── app/                  ← App Router lives here
│   ├── layout.jsx        ← Root layout (wraps all pages)
│   ├── page.jsx          ← Home page  (route: /)
│   ├── globals.css       ← Global styles
│   └── favicon.ico
├── public/               ← Static files (images, icons)
├── next.config.js        ← Next.js configuration
├── package.json
└── tailwind.config.js
```

If you selected the `src/` option during setup, the same routing files live in
`src/app/`. The `public/` directory is different: files there are served from
the site root, so `public/logo.png` is referenced as `/logo.png`.

### Rendering vocabulary for today

You do not need to master all rendering strategies yet, but these terms explain
why Next.js is useful:

- **CSR (Client-Side Rendering):** the browser receives JavaScript and builds
  much of the UI there.
- **SSR (Server-Side Rendering):** the server creates HTML for a request.
- **SSG (Static Site Generation):** HTML is generated ahead of time and can be
  served quickly.
- **ISR (Incremental Static Regeneration):** a generated page can be refreshed
  after a chosen interval.

App Router pages are Server Components by default. That does not mean every
route is permanently static; rendering and caching depend on the code and data
used by the route. Client Components are introduced with `'use client'` when a
component needs browser-only state, event handlers, or hooks.

---

### File-based Routing

In Next.js App Router, **every folder inside `app/` is a route segment**, and a `page.jsx` file inside that folder makes it accessible.

```
app/
├── page.jsx              → /
├── about/
│   └── page.jsx          → /about
├── contact/
│   └── page.jsx          → /contact
└── blog/
    ├── page.jsx          → /blog
    └── [slug]/
        └── page.jsx      → /blog/:slug  (dynamic)
```

### Creating a Page

```jsx
// app/about/page.jsx
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to the about page.</p>
    </div>
  );
}
```

That's it. No `<Route>` setup, no router config. The file IS the route.

The rules to remember are:

- `app/page.jsx` maps to `/`.
- `app/about/page.jsx` maps to `/about`.
- Folder names become URL segments.
- A folder without a `page.jsx` is not automatically a public page.
- `[slug]` is a dynamic segment. Its value is available through `params`.
- Special files such as `layout.jsx` and `loading.jsx` have framework-defined
  behavior and are not ordinary route pages.

For example:

```text
app/blog/[slug]/page.jsx
```

matches `/blog/hello-next`, `/blog/routing`, and other values. The route is
defined once; the URL value changes.

---

### Linking Between Pages

Use Next.js `<Link>` component (not `<a>` tags for internal links):

```jsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

**Why not `<a>`?** — `<a>` causes a full page reload. `<Link>` does client-side navigation (faster, no flash).

---

### Navigating Programmatically

```jsx
'use client'; // needed for hooks — explained on Day 03

import { useRouter } from 'next/navigation';

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = () => {
    // after login logic...
    router.push('/dashboard');    // adds to history stack
    // router.replace('/dashboard'); // replaces current history entry (no Back)
    // router.back();               // go back one step in history
    // router.refresh();            // re-fetch server data for current route
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

---

### Active Link Styling with `usePathname`

Highlight the current page in your Navbar using `usePathname`:

```jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname(); // e.g. '/about'

  return (
    <nav>
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          style={{
            fontWeight: pathname === link.href ? 'bold' : 'normal',
            color: pathname === link.href ? '#0070f3' : 'inherit',
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
```

> `usePathname` requires `'use client'` because it reads browser state.

---

### Link Prefetching

`<Link>` prefetches the destination page **automatically** when it enters the viewport in production. You can control this:

```jsx
{/* Default — prefetches automatically in production */}
<Link href="/about">About</Link>

{/* Disable prefetch for rarely visited pages */}
<Link href="/admin" prefetch={false}>Admin</Link>
```

### When to use which navigation tool

| Situation | Tool |
|-----------|------|
| User clicks an internal page link | `<Link href="/about">` |
| Code must navigate after an action | `router.push('/dashboard')` |
| The destination should replace the current history entry | `router.replace('/login')` |
| The user should return to the previous route | `router.back()` |
| The URL is external | A normal `<a href="https://...">` |

Use `<Link>` for normal navigation. Programmatic navigation belongs in a Client
Component, which is why the example needs `'use client'`.

---

## 💻 Practical Task

Build a small **Next.js Route Explorer**. Type each step yourself, then use
the checkpoint before continuing.

### Step 1: Check your tools

Run:

```bash
node --version
npm --version
```

Use Node.js 18.18 or newer for current Next.js releases. If either command is
not recognized, install Node.js before continuing.

### Step 2: Create the project

Run this from the folder where you keep practice projects:

```bash
npx create-next-app@latest day01-practice
cd day01-practice
npm run dev
```

When prompted, choose:

| Prompt | Choice |
|--------|--------|
| TypeScript | No |
| ESLint | Yes |
| Tailwind CSS | Yes or No; use whichever you want to practice |
| `src/` directory | No, to match the examples below |
| App Router | Yes |
| Import alias | No |

Open `http://localhost:3000`. **Checkpoint:** the starter page loads. Keep
the server running while editing; stop it with `Ctrl+C` when finished.

### Step 3: Replace the home page

Replace `app/page.jsx` with:

```jsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>Next.js Route Explorer</h1>
      <p>Learn how folders become URLs in the App Router.</p>
      <Link href="/about">Start with the about page</Link>
    </main>
  );
}
```

**Checkpoint:** refresh `/` and confirm the heading and link appear.

### Step 4: Create two static routes

Create `app/about/page.jsx`:

```jsx
export default function AboutPage() {
  return (
    <main>
      <h1>About this course</h1>
      <p>We are learning Next.js one framework convention at a time.</p>
    </main>
  );
}
```

Create `app/contact/page.jsx`:

```jsx
export default function ContactPage() {
  return (
    <main>
      <h1>Contact</h1>
      <p>Email: learner@example.com</p>
    </main>
  );
}
```

Visit `/about` and `/contact` directly. **Checkpoint:** each URL renders a
different page without adding a route configuration file.

### Step 5: Add a shared navigation bar

Create `components/Navbar.jsx`:

```jsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav aria-label="Main navigation">
      <Link href="/">Home</Link>{' '}
      <Link href="/about">About</Link>{' '}
      <Link href="/contact">Contact</Link>
    </nav>
  );
}
```

Open `app/layout.jsx` and add the import, then render `<Navbar />` above
`{children}`:

```jsx
import Navbar from '../components/Navbar';
```

```jsx
<body>
  <Navbar />
  {children}
</body>
```

The exact starter layout may contain extra markup. Keep its existing `<html>`
and `<body>` elements and insert the two snippets in those locations.

**Checkpoint:** the navigation is visible on all three routes. Click the links
and observe that the app changes routes without a full browser reload.

### Step 6: Create a dynamic route

Create `app/blog/[slug]/page.jsx`:

```jsx
export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  return (
    <main>
      <h1>Blog post: {slug}</h1>
      <p>This page was matched by a dynamic route segment.</p>
    </main>
  );
}
```

In current Next.js versions, `params` is asynchronous in App Router page
props, so the example awaits it. Visit `/blog/hello-next` and
`/blog/file-based-routing`. **Checkpoint:** both URLs use the same file but
display different slug values.

### Step 7: Verify the route tree

Your project should now contain:

```text
app/
├── about/
│   └── page.jsx          -> /about
├── blog/
│   └── [slug]/
│       └── page.jsx      -> /blog/:slug
├── contact/
│   └── page.jsx          -> /contact
├── layout.jsx            -> shared wrapper
└── page.jsx              -> /
components/
└── Navbar.jsx
```

Try `/does-not-exist`. It should show Next.js's not-found response. Do not add
a custom `not-found.jsx` yet; that belongs to the next lessons.

**Expected file structure:**
```
app/
├── layout.jsx        ← add Navbar here
├── page.jsx          ← Home
├── about/
│   └── page.jsx
└── contact/
    └── page.jsx
components/
└── Navbar.jsx
```

---

## ✅ End-of-Day Quiz

Try to answer these **before** checking the answers below.

**Q1.** What command creates a new Next.js project?

**Q2.** What file do you create to make `/dashboard` a route?

**Q3.** What is the difference between `<a href>` and `<Link href>` in Next.js?

**Q4.** Where does the App Router look for your pages?

**Q5.** What does `layout.jsx` do?

**Q6.** What URL matches `app/blog/[slug]/page.jsx`?

**Q7.** Why is `Link` preferred over `<a>` for an internal route?

**Q8.** What is the difference between a static segment such as `about` and a
dynamic segment such as `[slug]`?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** `npx create-next-app@latest my-app`

**A2.** `app/dashboard/page.jsx`

**A3.** `<a>` triggers a full page reload. `<Link>` does client-side navigation — faster and preserves React state.

**A4.** Inside the `app/` directory. Every folder with a `page.jsx` becomes a route.

**A5.** `layout.jsx` is a wrapper that persists across route changes. Anything in it (like a Navbar or footer) stays mounted when navigating between pages.

**A6.** URLs such as `/blog/hello-next`; `hello-next` becomes the `slug` value.

**A7.** `Link` enables Next.js client-side navigation and prefetching behavior,
while an internal `<a>` normally causes a full document request.

**A8.** `about` always matches the literal segment `/about`. `[slug]` matches
different values in that position and exposes the value through `params`.

</details>

---

## 📝 Notes

> Use this space to write your own notes as you learn today's material.

-
-
-
