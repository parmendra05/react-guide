# 🎯 Next.js Interview Questions & Answers

> 60+ questions organized by topic and difficulty. Use the self-rating column to track your confidence.
>
> **Rating scale:** ❌ Don't know → 🟡 Shaky → ✅ Solid

---

## 📋 How to Use This File

1. Cover the answer and try to answer each question out loud
2. Rate your confidence honestly
3. Re-read the relevant day file for any ❌ or 🟡 answers
4. Revisit weak areas every few days until everything is ✅

---

## 🟢 Beginner Questions (Days 1–3)

### Q1. What is Next.js and why use it over plain React?

**Answer:** Next.js is a React framework that adds server-side rendering, static site generation, file-based routing, built-in API routes, and performance optimizations. Plain React (CRA/Vite) is client-side only — bad for SEO and initial load performance. Next.js solves these by rendering HTML on the server, so crawlers see real content and users see pages faster.

**My rating:** ___

---

### Q2. What is the App Router? How is it different from the Pages Router?

**Answer:** The App Router (introduced in Next.js 13) lives in the `app/` directory and uses a new architecture based on React Server Components. The Pages Router lives in `pages/` and uses older data-fetching patterns (`getServerSideProps`, `getStaticProps`). The App Router supports nested layouts, streaming, Server Components, and Server Actions — features the Pages Router doesn't have. The App Router is the recommended approach for all new projects.

**My rating:** ___

---

### Q3. How does file-based routing work in Next.js?

**Answer:** Every folder inside `app/` is a route segment. A `page.jsx` file inside a folder makes that route publicly accessible. For example, `app/about/page.jsx` maps to `/about`, and `app/blog/[slug]/page.jsx` maps to `/blog/:slug`. You don't write any router configuration — the file structure IS the router.

**My rating:** ___

---

### Q4. What is the difference between `<Link>` and `<a>` in Next.js?

**Answer:** `<a>` triggers a full browser page reload — the entire page is re-requested from the server. `<Link>` from `next/link` does client-side navigation — it prefetches the destination page in the background and transitions without a full reload. This is faster, preserves React state, and avoids a white flash between pages.

**My rating:** ___

---

### Q5. What are the special files in the App Router and what do they do?

**Answer:**
- `page.jsx` — the UI for a route; what the user sees
- `layout.jsx` — wraps pages and persists across navigation (no re-render on route change)
- `loading.jsx` — automatically wraps the page in a `<Suspense>` boundary; shown while the page loads
- `error.jsx` — catches errors thrown during rendering; must be a Client Component
- `not-found.jsx` — shown when `notFound()` is called or a route doesn't exist
- `route.js` — creates an API endpoint; no UI

**My rating:** ___

---

### Q6. What is a layout in Next.js and why is it useful?

**Answer:** A layout is a component defined in `layout.jsx` that wraps all pages within its folder. Critically, layouts **do not re-render** when navigating between child routes — they stay mounted. This makes them ideal for persistent UI like navbars, sidebars, and footers. You can nest layouts; a dashboard layout can wrap all dashboard pages while a root layout wraps the entire app.

**My rating:** ___

---

### Q7. What is a Server Component? What can it NOT do?

**Answer:** A Server Component runs only on the server — its code is never sent to the browser as JavaScript. It can directly access databases, read environment secrets, and do async data fetching without `useEffect`. It CANNOT use: `useState`, `useEffect`, browser APIs (`window`, `document`, `localStorage`), or event handlers (`onClick`, `onChange`). In the App Router, all components are Server Components by default.

**My rating:** ___

---

### Q8. What is a Client Component? How do you create one?

**Answer:** A Client Component runs in the browser and has full access to React hooks, browser APIs, and event handlers. You create one by adding `'use client'` as the very first line of the file (before any imports). This directive marks a "boundary" — once you're in a Client Component tree, all its imports are also treated as client-side code.

**My rating:** ___

---

### Q9. Can a Server Component render a Client Component? What about the reverse?

**Answer:** Yes — a Server Component can import and render a Client Component. This is the normal pattern: fetch data on the server, pass it to an interactive Client Component as props. The reverse — importing a Server Component inside a Client Component — does NOT work as expected. Once you're in a Client Component tree, imported components are treated as client-side code even if they have no `'use client'` directive.

**My rating:** ___

---

### Q10. What is hydration in Next.js?

**Answer:** Hydration is the process where React takes the static HTML rendered on the server and "wakes it up" in the browser by attaching JavaScript event listeners. The user sees the HTML immediately (fast), then React hydrates it to make it interactive. Client Components are always hydrated; Server Components are never sent to the browser as JavaScript so they don't hydrate.

**My rating:** ___

---

## 🟡 Intermediate Questions (Days 4–7)

### Q11. What are the four data-fetching strategies in Next.js?

**Answer:**
- **SSG** — page is pre-rendered at build time; fastest, but data can be stale
- **SSR** — page re-renders on every request; always fresh, but slower
- **ISR** — page is pre-rendered at build, then re-generated in the background on a timer
- **CSR** — data is fetched in the browser after the page loads; no server involvement

**My rating:** ___

---

### Q12. How do you opt into SSR (no caching) for a fetch call?

**Answer:** Pass `cache: 'no-store'` to the fetch options:
```js
fetch(url, { cache: 'no-store' })
```
This tells Next.js never to cache the response — the fetch runs fresh on every request, making the page server-side rendered.

**My rating:** ___

---

### Q13. What is ISR and how do you implement it?

**Answer:** Incremental Static Regeneration builds a page statically at deploy time, then re-generates it in the background at a defined interval without requiring a full redeployment. Implement it with:
```js
fetch(url, { next: { revalidate: 60 } }) // regenerate every 60 seconds
```
After the interval, the next request triggers a background rebuild while the stale page is still served. The updated page is served from the next request onward.

**My rating:** ___

---

### Q14. What is `generateStaticParams` and when do you use it?

**Answer:** `generateStaticParams` is an async function exported from a dynamic route file (e.g., `app/blog/[slug]/page.jsx`) that returns an array of param objects. Next.js uses this to pre-build all those pages at build time (SSG). Without it, dynamic routes are rendered on-demand (SSR). Use it when you know all possible values at build time (blog posts, product pages, documentation).

**My rating:** ___

---

### Q15. How do you create an API route in Next.js App Router?

**Answer:** Create a `route.js` file inside `app/api/...`. Export named functions for each HTTP method: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`. For example:
```js
// app/api/users/route.js
export async function GET(request) {
  return Response.json([{ id: 1, name: 'Alice' }]);
}
```
The function receives a `Request` object and must return a `Response`.

**My rating:** ___

---

### Q16. How do you read the request body in a POST route handler?

**Answer:**
```js
export async function POST(request) {
  const body = await request.json(); // parses JSON body
  // or: const formData = await request.formData();
  // or: const text = await request.text();
}
```

**My rating:** ___

---

### Q17. How do you read URL query parameters in a route handler?

**Answer:**
```js
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const page = Number(searchParams.get('page')) || 1;
}
```

**My rating:** ___

---

### Q18. What is middleware in Next.js and where does it live?

**Answer:** Middleware is a function that runs **before** a request reaches a page or API route. It can redirect, rewrite, modify headers, or block the request. It lives in `middleware.js` at the project root (same level as `app/`). You can scope it to specific routes using an exported `config.matcher` array.

**My rating:** ___

---

### Q19. How do you protect a route so only authenticated users can access it?

**Answer:** Use middleware to check for a valid session token before the page renders:
```js
// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*'] };
```

**My rating:** ___

---

### Q20. What is the difference between `NEXT_PUBLIC_` env vars and regular ones?

**Answer:** Regular env variables (e.g., `DATABASE_URL`) are available only on the server — in Server Components, route handlers, and middleware. They are never sent to the browser. `NEXT_PUBLIC_` variables (e.g., `NEXT_PUBLIC_API_URL`) are embedded into the client-side JavaScript bundle at build time and are visible to anyone who inspects the page source. Never put secrets in `NEXT_PUBLIC_` variables.

**My rating:** ___

---

### Q21. What does `NextResponse.redirect()` do versus `NextResponse.next()`?

**Answer:** `NextResponse.redirect(url)` sends the client to a different URL (HTTP 302 by default). The browser's address bar changes. `NextResponse.next()` passes the request through to the next handler (the page or API route) without any change. Think of `next()` as "let this request through."

**My rating:** ___

---

### Q22. How do you deploy a Next.js app to Vercel?

**Answer:** Push the project to GitHub, connect the GitHub repo in the Vercel dashboard, add environment variables in Vercel's project settings, and click Deploy. Every push to `main` triggers an automatic redeploy. Vercel auto-detects Next.js and configures everything — no build scripts needed.

**My rating:** ___

---

### Q23. What is `notFound()` and when do you use it?

**Answer:** `notFound()` is a function from `next/navigation` that you call inside a Server Component or route handler when a resource doesn't exist. It triggers the nearest `not-found.jsx` to render a 404 page. Common use case: fetching a blog post by slug and calling `notFound()` if the result is null.

**My rating:** ___

---

### Q24. What does `router.push()` do and how is it different from `router.replace()`?

**Answer:** Both navigate programmatically in Client Components. `router.push('/path')` adds the new URL to the browser history stack (user can press Back to return). `router.replace('/path')` replaces the current history entry — the user cannot navigate back to the previous URL. Use `replace` for redirects after auth or form submission where going "back" would be confusing.

**My rating:** ___

---

## 🔵 Intermediate-Advanced Questions (Days 8–11)

### Q25. What is the difference between CSS Modules and Tailwind CSS?

**Answer:** CSS Modules are scoped CSS files — you write regular CSS but each class gets a unique name at build time, preventing collisions. Best for teams that prefer writing CSS. Tailwind CSS provides utility classes applied directly in JSX — no CSS files needed. Best for speed and consistency. Both can coexist in the same project.

**My rating:** ___

---

### Q26. What does `next/font` do that a normal Google Fonts `<link>` doesn't?

**Answer:** `next/font` downloads font files and self-hosts them at build time. There's no runtime request to Google's servers — this improves performance, privacy (no third-party requests), eliminates CORS issues, and prevents Cumulative Layout Shift (CLS) because the font is always available instantly.

**My rating:** ___

---

### Q27. Why should you always use `next/image` instead of `<img>`?

**Answer:** `next/image` automatically: converts images to modern formats (WebP/AVIF), serves the correct size for each device's screen, lazy loads images below the fold, and reserves space to prevent layout shift (CLS). A plain `<img>` does none of this and will hurt Core Web Vitals scores.

**My rating:** ___

---

### Q28. What is the `priority` prop on `<Image>` and when should you use it?

**Answer:** `priority` tells Next.js to preload the image — it adds a `<link rel="preload">` in the `<head>`. Use it on images that are visible without scrolling (above the fold), particularly the hero image or the page's Largest Contentful Paint (LCP) element. Preloading these images directly improves LCP scores.

**My rating:** ___

---

### Q29. What is React Query and why use it over raw `useEffect` + `fetch`?

**Answer:** React Query is a server-state management library. Compared to `useEffect` + `fetch`, it provides: automatic caching (no duplicate requests), background refetching (keeps data fresh), loading/error states out of the box, pagination helpers, and cache invalidation. With raw `useEffect`, you have to implement all of this manually and handle race conditions and memory leaks yourself.

**My rating:** ___

---

### Q30. What is `staleTime` in React Query?

**Answer:** `staleTime` defines how long fetched data is considered "fresh." During this window, React Query will not refetch the data even if the component re-mounts or the window refocuses. After `staleTime` elapses, the data is "stale" and React Query will refetch it in the background on next access. Default is 0 (always stale).

**My rating:** ___

---

### Q31. How do you invalidate a React Query cache after a mutation?

**Answer:** Call `queryClient.invalidateQueries({ queryKey: ['key'] })` inside the `onSuccess` callback of `useMutation`. This marks matching cache entries as stale and triggers a background refetch, so the UI reflects the new data automatically.

**My rating:** ___

---

### Q32. What is Zustand and when should you use it?

**Answer:** Zustand is a minimal global state library for client-side UI state — things like a shopping cart, a theme preference, or sidebar open/closed. Use it for state that is shared across multiple Client Components but doesn't come from a server. Don't use it for server-fetched data — that belongs in React Query.

**My rating:** ___

---

### Q33. What is a Server Action in Next.js?

**Answer:** A Server Action is an async function marked with `'use server'` that runs on the server but can be called from a Client Component or used directly as a `<form action>`. They eliminate the need for separate API routes for form submissions. They can directly access the database, call `revalidatePath`, and `redirect` — all without an HTTP round trip.

**My rating:** ___

---

### Q34. How do you handle validation in a Server Action?

**Answer:** Parse the `FormData` and validate it with a schema library like Zod using `safeParse`. If validation fails, return the errors as a plain object (don't throw). Use `useFormState` in the Client Component to receive and display those errors inline.

```js
const result = schema.safeParse({ title: formData.get('title') });
if (!result.success) {
  return { error: result.error.flatten().fieldErrors };
}
```

**My rating:** ___

---

### Q35. What is `useFormStatus` and what problem does it solve?

**Answer:** `useFormStatus` is a React hook that, when used inside a `<form>`, reads the `pending` state of the form's action. It solves the problem of disabling the submit button while a Server Action is running — without needing to manually manage a `useState` loading flag.

**My rating:** ___

---

### Q36. Explain the four caching layers in Next.js.

**Answer:**
1. **Request Memoization** — deduplicates identical `fetch` calls within a single render pass (in-memory, per request)
2. **Data Cache** — persists `fetch` responses to disk across requests (controlled by `cache` / `revalidate` options)
3. **Full Route Cache** — stores the fully rendered HTML and React Server Component payload on disk (for static/ISR pages)
4. **Router Cache** — stores RSC payloads in the browser memory; speeds up back/forward navigation (30s for dynamic, 5min for static)

**My rating:** ___

---

### Q37. What is the difference between `revalidatePath` and `revalidateTag`?

**Answer:** `revalidatePath('/path')` clears the cache for one specific URL. `revalidateTag('tag-name')` clears the cache for all fetches tagged with that label — useful when one mutation affects data shown on multiple pages. Tag a fetch with `next: { tags: ['products'] }` and call `revalidateTag('products')` to update all pages that use that data.

**My rating:** ___

---

### Q38. What does `router.refresh()` do?

**Answer:** It clears the client-side Router Cache for the current page and triggers a re-fetch of the Server Component data from the server, without a full browser reload. Use it in Client Components after a mutation (e.g., deleting an item) to make the page reflect the updated data.

**My rating:** ___

---

### Q39. What is `dynamic(() => import(...))` and when do you need `ssr: false`?

**Answer:** `dynamic()` is Next.js's lazy loading wrapper around `import()`. The component is only loaded when it's needed (code splitting). `ssr: false` tells Next.js to skip server-side rendering for that component — necessary for libraries that access browser-only APIs (`window`, `document`, WebGL) and would throw errors on the server.

**My rating:** ___

---

### Q40. What is Suspense streaming and why is it valuable?

**Answer:** Normally, if a page has a slow data fetch, the entire page is blocked until the data arrives. With `<Suspense>` boundaries, each wrapped section streams to the browser independently as soon as its data is ready. Users see a skeleton/fallback immediately and each section pops in when ready — much better perceived performance than waiting for the slowest fetch.

**My rating:** ___

---

## 🔴 Advanced Questions (Days 12–14)

### Q41. How does the Next.js Metadata API work?

**Answer:** Export a `metadata` object or `generateMetadata` async function from any `page.jsx` or `layout.jsx`. Next.js merges metadata from root layout down to the leaf page, with child values overriding parent values. This generates all `<head>` tags automatically — no `react-helmet` or manual `<head>` manipulation needed.

**My rating:** ___

---

### Q42. What is the difference between `metadata` and `generateMetadata`?

**Answer:** `metadata` is a static export — values are fixed at build time. `generateMetadata` is an async function — it can `fetch` data to generate dynamic metadata (e.g., the blog post title for a dynamic route). Both are exported from `page.jsx` or `layout.jsx` and Next.js calls them automatically.

**My rating:** ___

---

### Q43. What are Open Graph tags and why do they matter?

**Answer:** Open Graph tags (`og:title`, `og:description`, `og:image`, etc.) control how a URL appears when shared on social platforms like Twitter, LinkedIn, Facebook, and Slack. Without them, platforms display a raw URL or generate a poor-quality preview. A well-crafted OG image and title dramatically increases click-through rates on shared links.

**My rating:** ___

---

### Q44. How do you generate a dynamic OG image in Next.js?

**Answer:** Create a route handler (e.g., `app/og/route.jsx`) that uses `ImageResponse` from `next/og`. It takes JSX and renders it to a PNG at request time. Pass parameters via query string (`?title=My+Post`) and use the resulting URL as the `og:image` value in your metadata.

**My rating:** ___

---

### Q45. How do you generate a `sitemap.xml` in Next.js?

**Answer:** Create `app/sitemap.js` and export a default async function that returns an array of URL objects (with `url`, `lastModified`, `changeFrequency`, `priority`). Next.js automatically serves this as `/sitemap.xml`. The function can fetch data to include dynamic URLs like blog posts.

**My rating:** ___

---

### Q46. What is structured data (JSON-LD) and how do you add it?

**Answer:** JSON-LD is a format for communicating page content to search engines in a machine-readable way. It enables "rich results" — star ratings, FAQ boxes, article metadata — in Google Search. Add it by rendering a `<script type="application/ld+json">` tag in your page component using `dangerouslySetInnerHTML`.

**My rating:** ___

---

### Q47. What is the recommended testing setup for Next.js?

**Answer:** Vitest + React Testing Library for unit and integration tests. Playwright for E2E tests. Vitest is preferred over Jest because it's faster and has native ESM support. The test environment should be set to `jsdom` for component tests.

**My rating:** ___

---

### Q48. What is the difference between `getByRole` and `getByTestId` in Testing Library?

**Answer:** `getByRole` queries by ARIA role (button, heading, link, textbox) — it tests that the UI is semantically correct and accessible to screen readers. `getByTestId` relies on artificial `data-testid` attributes invisible to real users and assistive technologies. The Testing Library docs recommend `getByRole` as the primary query because it catches accessibility regressions.

**My rating:** ___

---

### Q49. How do you test a component that makes a `fetch` call?

**Answer:** Mock `global.fetch` in `beforeEach` using `vi.fn().mockResolvedValue(...)`. Use `waitFor()` or `findBy*` queries to wait for the async render to complete. Clean up with `vi.restoreAllMocks()` in `afterEach`.

**My rating:** ___

---

### Q50. What is an intercepting route in Next.js?

**Answer:** Intercepting routes let you display a route in a different context — like showing `/photos/1` as a modal overlay when navigated to from within the app, while showing the full page when the URL is accessed directly or on refresh. Use `(.)folder` syntax inside a `@modal` parallel slot.

**My rating:** ___

---

### Q51. What is a parallel route?

**Answer:** Parallel routes render multiple independent pages simultaneously in the same layout using `@slotName` folders. Each slot has its own `page.jsx`, `loading.jsx`, and `error.jsx`. The layout receives them as separate props. This is ideal for dashboards where different sections fetch data independently and shouldn't block each other.

**My rating:** ___

---

### Q52. What is the Edge Runtime and when would you use it?

**Answer:** The Edge Runtime runs your code on CDN edge nodes closer to users — much lower latency than a regional server. Use it for lightweight tasks: geolocation, auth token verification, A/B testing, header manipulation. Avoid it for: heavy computation, large npm packages, and anything that requires Node.js-specific APIs. Enable it with `export const runtime = 'edge'`.

**My rating:** ___

---

### Q53. How do you prevent too many Prisma connections in development?

**Answer:** Next.js hot-reloads frequently in development, creating a new `PrismaClient` on every reload and exhausting the database connection pool. The solution is a singleton pattern — store the client on the `globalThis` object and reuse it:
```js
export const db = globalThis.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
```

**My rating:** ___

---

### Q54. What is `unstable_cache` and how does it differ from fetch caching?

**Answer:** `unstable_cache` caches the result of **any** async function — not just `fetch`. This is essential when you query a database directly (with Prisma, Drizzle, etc.) and want ISR-style caching with time-based revalidation or cache tags. Fetch caching only works for HTTP requests.

**My rating:** ___

---

## ⚡ Rapid-Fire Conceptual Questions

### Q55. What does `'use client'` do?
It marks the file as a Client Component boundary. The component and all its imports run in the browser and can use hooks, event handlers, and browser APIs.

**My rating:** ___

---

### Q56. What does `'use server'` do?
It marks exported async functions as Server Actions — they run on the server but can be called from client-side code or used as form actions.

**My rating:** ___

---

### Q57. What is the `fill` prop on `<Image>`?
It makes the image fill its parent container instead of requiring explicit `width` and `height` props. The parent must have `position: relative` and a defined size.

**My rating:** ___

---

### Q58. What is `clsx` used for?
It conditionally joins CSS class names — cleaner than template literals when building conditional class strings (e.g., with Tailwind).

**My rating:** ___

---

### Q59. What is the `enabled` option in `useQuery`?
It controls whether a query runs. Set `enabled: false` to disable it or `enabled: !!someValue` to only run it when `someValue` is truthy (dependent/chained queries).

**My rating:** ___

---

### Q60. What is the purpose of `revalidatePath` inside a Server Action?
After a mutation (create/update/delete), it clears the Next.js cache for a specific route so the next visit shows fresh data instead of stale cached content.

**My rating:** ___

---

### Q61. Can you use `async/await` directly in a Server Component?
Yes. Server Components are async by default. You can `await` data fetches directly in the component body without `useEffect`.

**My rating:** ___

---

### Q62. What happens to `layout.jsx` when navigating between sibling pages?
It does NOT re-render. The layout stays mounted; only the `{children}` (the page) changes. This is intentional — it keeps sidebar state, scroll position, and any layout-level data intact.

**My rating:** ___

---

## 📊 Progress Tracker

Count your ratings after each review session:

| Session | ✅ Solid | 🟡 Shaky | ❌ Don't know |
|---------|---------|---------|--------------|
| Session 1 | | | |
| Session 2 | | | |
| Session 3 | | | |

**Target:** All 62 questions rated ✅ before your interview.

---

## 🔗 Quick Reference — Key Commands

```bash
# Create new app
npx create-next-app@latest my-app

# Dev server
npm run dev

# Production build
npm run build && npm run start

# Run tests (single pass)
npm run test

# Prisma migrations
npx prisma migrate dev --name init
npx prisma studio
```

## 🔗 Quick Reference — Decision Table

| Scenario | Solution |
|----------|---------|
| Fetch data, no interactivity | Server Component + `async/await` |
| User clicks a button | `'use client'` + event handler |
| Protect a route | `middleware.js` |
| Submit a form to DB | Server Action + `'use server'` |
| Data shared across many client components | Zustand store |
| Cache API responses on the client | React Query (`useQuery`) |
| Pre-build dynamic pages at build time | `generateStaticParams` |
| Refresh data every 60 seconds | `next: { revalidate: 60 }` |
| Refresh data immediately after mutation | `revalidatePath()` / `revalidateTag()` |
| Lazy load a heavy component | `dynamic(() => import(...))` |
| Add page title + OG tags | `metadata` or `generateMetadata` |
| Run code at CDN edge | `export const runtime = 'edge'` |
