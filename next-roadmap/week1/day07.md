# Day 07 — Build, Deploy & Week 1 Mini Project

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
[ ] Mini project deployed
```

---

## 🧠 Concepts

### The Next.js Build Process

When you run `npm run build`, Next.js:
1. Compiles all TypeScript / JSX
2. Analyzes each page and decides SSG / SSR / ISR
3. Pre-renders all static pages at build time
4. Generates optimized bundles

```bash
npm run build
```

You'll see output like:
```
Route (app)                              Size     First Load JS
┌ ○ /                                   1.2 kB        85 kB
├ ○ /about                              980 B         84 kB
├ ● /blog/[slug]                        1.5 kB        86 kB
└ ƒ /dashboard                          2.1 kB        87 kB

○  (Static)   prerendered as static content
●  (SSG)      prerendered at build time (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

### Running Production Build Locally

```bash
npm run build   # build the app
npm run start   # run the production server (port 3000)
```

Always test your production build before deploying — dev mode hides some bugs.

---

### Deploying to Vercel (Recommended)

Vercel is built by the same team as Next.js. Deployment is essentially zero-config.

**Step 1 — Push your project to GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/my-app.git
git push -u origin main
```

**Step 2 — Connect to Vercel**

1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click "Add New Project"
3. Import your GitHub repository
4. Set your environment variables (same as `.env.local`)
5. Click Deploy

Every `git push` to `main` triggers an automatic redeploy.

---

### Environment Variables on Vercel

In the Vercel dashboard:
- Go to your project → Settings → Environment Variables
- Add all your `.env.local` keys and values
- Choose which environments they apply to (Production / Preview / Development)

---

### Deploying to Other Platforms

Next.js can be deployed anywhere Node.js runs:

| Platform | Notes |
|----------|-------|
| **Vercel** | Zero-config, best DX, recommended |
| **Netlify** | Good support via Next.js plugin |
| **Railway** | Docker-based, good for full-stack |
| **AWS / GCP / Azure** | Use Docker image or standalone mode |
| **Self-hosted VPS** | `npm run build && npm run start` |

#### Standalone Output (for Docker)

```js
// next.config.js
module.exports = {
  output: 'standalone',
};
```

This creates a self-contained folder you can put in a Docker container.

---

### Draft Mode (Preview Mode)

Draft Mode lets you bypass static generation to preview unpublished CMS content in real time. Enable it via an API route, then check it in pages:

```js
// app/api/draft/route.js
import { draftMode } from 'next/headers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.DRAFT_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  draftMode().enable();
  return Response.redirect(new URL('/', request.url));
}
```

```jsx
// app/blog/[slug]/page.jsx
import { draftMode } from 'next/headers';

export default async function BlogPost({ params }) {
  const { isEnabled } = draftMode();

  // Fetch draft content when draft mode is on, published otherwise
  const post = await fetch(
    `https://cms.example.com/posts/${params.slug}?preview=${isEnabled}`
  ).then(r => r.json());

  return <article>{post.content}</article>;
}
```

Visit `/api/draft?secret=YOUR_SECRET` to enable Draft Mode. It sets a cookie that bypasses the static cache until you disable it.

---

### TypeScript Support

Next.js has first-class TypeScript support. When you run `create-next-app` and choose TypeScript, all files use `.tsx` / `.ts`. You get typed `params`, `searchParams`, metadata, and route handlers automatically:

```ts
// app/blog/[slug]/page.tsx
import { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: params.slug };
}

export default function BlogPost({ params }: Props) {
  return <h1>{params.slug}</h1>;
}
```

Even in a JavaScript project, you can add JSDoc types for autocomplete:

```js
// @ts-check
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
```

---

### `next.config.js` — Key Options

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },

  // Redirect old URLs
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true, // 301 redirect
      },
    ];
  },

  // Rewrite (proxy requests without changing URL)
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://external-api.com/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

---

### Analyzing Your Bundle

Find out what's making your app large:

```bash
npm install @next/bundle-analyzer
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});
```

```bash
ANALYZE=true npm run build
```

---

## 🏗️ Week 1 Mini Project — Blog App

Apply everything from Days 01–06 by building a simple blog.

### Requirements

**Pages:**
- `/` — Home page with list of recent posts (fetched via SSG)
- `/blog` — All posts page (ISR, revalidates every 60 seconds)
- `/blog/[slug]` — Individual post page (dynamic SSG with `generateStaticParams`)
- `/dashboard` — Protected page (requires auth, shows logged-in user)

**API Routes:**
- `GET /api/posts` — Returns all posts
- `GET /api/posts/[slug]` — Returns a single post

**Features:**
- Root layout with Navbar (Home, Blog, Dashboard links)
- `loading.jsx` on the blog page
- `not-found.jsx` for 404 errors
- Auth protection on `/dashboard` using middleware
- Environment variable for API base URL
- Deployed to Vercel

### Suggested Data Source

Use the JSONPlaceholder API: `https://jsonplaceholder.typicode.com/posts`
Map `id` as `slug` since JSONPlaceholder doesn't have slugs.

### Folder Structure

```
app/
├── layout.jsx
├── page.jsx                   ← Home
├── blog/
│   ├── loading.jsx
│   ├── page.jsx               ← All posts
│   └── [id]/
│       └── page.jsx           ← Single post
├── dashboard/
│   └── page.jsx               ← Protected
└── api/
    ├── auth/
    │   └── [...nextauth]/
    │       └── route.js
    └── posts/
        ├── route.js
        └── [id]/
            └── route.js
components/
└── Navbar.jsx
middleware.js
.env.local
```

---

## ✅ Week 1 Knowledge Check

Answer these before moving to Week 2:

**Q1.** What are the 4 rendering strategies in Next.js?

**Q2.** What symbol does Next.js use in the build output for a dynamically rendered route?

**Q3.** What is the purpose of `middleware.js`?

**Q4.** How do you pre-render dynamic routes at build time?

**Q5.** What command runs your app in production mode?

**Q6.** Name 3 special files in the App Router and their purpose.

**Q7.** What is the difference between `layout.jsx` and `template.jsx`?

**Q8.** What does calling `cookies()` or `headers()` inside a Server Component do to its rendering strategy?

**Q9.** How do you use `export const dynamic` to force a whole page to always be server-rendered?

**Q10.** What is Draft Mode and when would you use it?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** SSG (Static Site Generation), SSR (Server-Side Rendering), ISR (Incremental Static Regeneration), CSR (Client-Side Rendering).

**A2.** `ƒ` (Dynamic) means server-rendered on demand. `○` means static, `●` means SSG with generateStaticParams.

**A3.** Middleware runs before a request completes — used for auth checks, redirects, adding headers, and A/B testing without touching each individual page.

**A4.** Export `generateStaticParams` from the dynamic page file. It returns an array of param objects for every page to pre-build.

**A5.** `npm run build` then `npm run start`. The `npm run dev` command is for development only.

**A6.** Any 3 of: `page.jsx` (the page UI), `layout.jsx` (persistent wrapper), `loading.jsx` (Suspense fallback), `error.jsx` (error boundary), `not-found.jsx` (404 UI), `route.js` (API endpoint).

**A7.** `layout.jsx` stays mounted and does not re-render when navigating between child routes. `template.jsx` is re-mounted (re-rendered fresh) on every navigation — useful for enter/exit animations or resetting tab state.

**A8.** Calling `cookies()` or `headers()` automatically forces the route into dynamic rendering (SSR) — Next.js can no longer statically pre-render it because the output depends on the incoming request.

**A9.** `export const dynamic = 'force-dynamic'` at the top of a page file forces the entire route to be server-rendered on every request, equivalent to adding `cache: 'no-store'` to every fetch on that page.

**A10.** Draft Mode (formerly Preview Mode) lets you bypass static caching to preview unpublished CMS content in real time. Enable it via a secret API route — it sets a cookie that makes pages fetch fresh draft data instead of cached published data.

</details>

---

## 📝 Week 1 Reflection

> Before starting Week 2, answer these honestly:

- What concepts from Week 1 do you feel solid on?
- What do you need to revisit?
- Did you complete all 7 mini projects?

-
-
-
