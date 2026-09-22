# Day 01 — Setup, Introduction & File-based Routing

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### What is Next.js?

Next.js is a React framework built on top of React that adds:
- **Server-Side Rendering (SSR)** — HTML is generated on each request
- **Static Site Generation (SSG)** — HTML is pre-built at build time
- **File-based Routing** — Your folder/file structure = your URL routes
- **API Routes** — Backend endpoints inside your frontend project
- **Built-in optimizations** — Images, fonts, scripts, SEO

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

---

## 💻 Practical Task

**Build a 3-page website:**

1. Create a new Next.js app: `npx create-next-app@latest day01-practice`
2. Create these pages:
   - `/` — Home page with a heading and welcome text
   - `/about` — About page with your name and a short bio
   - `/contact` — Contact page with a fake email address
3. Create a `Navbar` component that links to all 3 pages
4. Import and use the Navbar in each page (or root layout)

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

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** `npx create-next-app@latest my-app`

**A2.** `app/dashboard/page.jsx`

**A3.** `<a>` triggers a full page reload. `<Link>` does client-side navigation — faster and preserves React state.

**A4.** Inside the `app/` directory. Every folder with a `page.jsx` becomes a route.

**A5.** `layout.jsx` is a wrapper that persists across route changes. Anything in it (like a Navbar or footer) stays mounted when navigating between pages.

</details>

---

## 📝 Notes

> Use this space to write your own notes as you learn today's material.

-
-
-
