# Day 08 — Styling, Fonts & Image Optimization

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### Styling Options in Next.js

Next.js supports multiple styling approaches out of the box. Pick what fits your team.

| Approach | File type | Scope | Best for |
|----------|-----------|-------|----------|
| Global CSS | `.css` | Global | Resets, base styles |
| CSS Modules | `.module.css` | Component-scoped | Avoiding class conflicts |
| Tailwind CSS | utility classes | Global | Rapid UI building |
| CSS-in-JS (styled-components) | JS | Component | Dynamic styles |
| Sass/SCSS | `.scss` | Global or module | Advanced CSS features |

---

### 1. Global CSS

```css
/* app/globals.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: sans-serif;
  background: #f9f9f9;
}
```

Import it only in `app/layout.jsx` (root layout):

```jsx
// app/layout.jsx
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

### 2. CSS Modules

CSS Modules scope styles to a single component — no class name collisions.

```css
/* components/Button.module.css */
.button {
  background: #0070f3;
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.button:hover {
  background: #0051bb;
}
```

```jsx
// components/Button.jsx
import styles from './Button.module.css';

export default function Button({ children, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}
```

The class name becomes something like `Button_button__xK7dQ` — unique and collision-proof.

---

### 3. Tailwind CSS

Tailwind is the most popular choice with Next.js. It's set up automatically when you choose it during `create-next-app`.

```jsx
// No CSS file needed — utility classes inline
export default function Card({ title, description }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );
}
```

#### Conditional classes with `clsx`

```bash
npm install clsx
```

```jsx
import clsx from 'clsx';

export default function Badge({ status }) {
  return (
    <span
      className={clsx(
        'px-3 py-1 rounded-full text-sm font-medium',
        {
          'bg-green-100 text-green-800': status === 'active',
          'bg-red-100 text-red-800': status === 'inactive',
          'bg-yellow-100 text-yellow-800': status === 'pending',
        }
      )}
    >
      {status}
    </span>
  );
}
```

---

### 4. Sass/SCSS

```bash
npm install sass
```

```scss
/* styles/dashboard.module.scss */
$primary: #0070f3;

.container {
  display: flex;
  gap: 1rem;

  .sidebar {
    width: 240px;
    background: lighten($primary, 45%);
  }

  .content {
    flex: 1;
  }
}
```

---

### 5. CSS-in-JS (styled-components) — SSR Setup

styled-components needs special config to work with Next.js SSR. Without it, styles flash on first load.

```bash
npm install styled-components
npm install -D @types/styled-components
```

```js
// next.config.js
module.exports = {
  compiler: {
    styledComponents: true, // enables SSR support + display names
  },
};
```

```jsx
'use client'; // styled-components is client-only

import styled from 'styled-components';

const Button = styled.button`
  background: #0070f3;
  color: white;
  padding: 0.5rem 1.25rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #0051bb;
  }
`;

export default function MyButton({ children }) {
  return <Button>{children}</Button>;
}
```

> In most new Next.js projects, Tailwind CSS or CSS Modules are preferred over CSS-in-JS — they have zero runtime overhead and work natively with Server Components.

---

### Combining Tailwind with `tailwind-merge`

`clsx` handles conditional classes, but Tailwind can produce conflicting utilities (e.g. `p-2` and `p-4` both present). `tailwind-merge` resolves conflicts by keeping only the last relevant class:

```bash
npm install tailwind-merge
```

```jsx
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

// Common pattern: combine clsx + twMerge into a helper
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Usage — the passed p-6 overrides the default p-4
export default function Card({ className, children }) {
  return (
    <div className={cn('bg-white rounded-xl p-4 shadow', className)}>
      {children}
    </div>
  );
}

// <Card className="p-6" /> → renders with p-6, not both p-4 and p-6
```

This `cn()` helper is the standard pattern used in shadcn/ui and most modern Next.js projects.

---

### Third-Party Scripts with `next/script`

Loading analytics, chat widgets, or ad scripts correctly matters for performance. Use `next/script` instead of raw `<script>` tags:

```jsx
// app/layout.jsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Loads after page is interactive — for analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />

        {/* Inline script with afterInteractive */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </body>
    </html>
  );
}
```

| Strategy | When it loads | Use for |
|----------|--------------|---------|
| `beforeInteractive` | Before page hydration | Critical polyfills |
| `afterInteractive` | After page hydration (default) | Analytics, tag managers |
| `lazyOnload` | During browser idle time | Chat widgets, low-priority scripts |
| `worker` | In a web worker (experimental) | Heavy computation |

---

### Next.js Font Optimization (`next/font`)

`next/font` automatically self-hosts fonts — no requests to Google's servers, no layout shift.

#### Google Fonts

```jsx
// app/layout.jsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

#### Local Fonts

```jsx
import localFont from 'next/font/local';

const myFont = localFont({
  src: [
    { path: './fonts/MyFont-Regular.woff2', weight: '400' },
    { path: './fonts/MyFont-Bold.woff2', weight: '700' },
  ],
  variable: '--font-my-font',
});
```

---

### Next.js Image Optimization (`next/image`)

The `<Image>` component from Next.js:
- Automatically serves the right size for each device
- Converts to modern formats (WebP, AVIF)
- Lazy loads by default (below-the-fold images)
- Prevents Cumulative Layout Shift (CLS)

#### Basic Usage

```jsx
import Image from 'next/image';

export default function Avatar() {
  return (
    <Image
      src="/images/avatar.jpg"   // local image from /public
      alt="User avatar"
      width={80}
      height={80}
      className="rounded-full"
    />
  );
}
```

#### Fill Mode (responsive container)

```jsx
<div className="relative w-full h-64">
  <Image
    src="/images/hero.jpg"
    alt="Hero banner"
    fill
    className="object-cover"
    priority  // load immediately (above the fold)
  />
</div>
```

#### External Images

Add the domain to `next.config.js`:

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },
};
```

```jsx
<Image
  src="https://images.unsplash.com/photo-123?w=800"
  alt="Landscape"
  width={800}
  height={500}
/>
```

---

### Key Image Props

| Prop | Purpose |
|------|---------|
| `src` | Image path (local or external URL) |
| `alt` | Alt text (required for accessibility) |
| `width` / `height` | Intrinsic size in pixels |
| `fill` | Fills parent container (use with `position: relative`) |
| `priority` | Preloads image (use for above-the-fold images) |
| `quality` | Compression 1–100, default 75 |
| `placeholder="blur"` | Shows blur hash while loading |
| `sizes` | Hints for responsive sizing |

---

### `placeholder="blur"` — Smooth Loading

Show a blurred preview while the full image loads. For local images this works automatically. For remote images you must provide a `blurDataURL`:

```jsx
import Image from 'next/image';
import avatarImg from '@/public/images/avatar.jpg'; // local import

// Local image — blur placeholder generated automatically at build time
export function LocalAvatar() {
  return (
    <Image
      src={avatarImg}
      alt="Avatar"
      width={80}
      height={80}
      placeholder="blur"  // ← works automatically for local imports
    />
  );
}

// Remote image — you must supply a blurDataURL (tiny base64 image)
export function RemoteAvatar({ src }) {
  return (
    <Image
      src={src}
      alt="Avatar"
      width={80}
      height={80}
      placeholder="blur"
      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
    />
  );
}
```

Generate a real `blurDataURL` from your images using the `plaiceholder` library for production use.

---

### `sizes` Prop — Responsive Image Hints

Tell the browser what size the image will be at different viewport widths, so it can download the right version:

```jsx
<Image
  src="/images/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  // At mobile: full viewport width
  // At tablet: half viewport width
  // At desktop: one-third viewport width
/>
```

Without `sizes`, the browser assumes the image takes up the full viewport and downloads a much larger file than needed.

---

### `<Image>` vs `<img>`

| | `<img>` | `next/image` |
|---|---------|--------------|
| Auto format conversion | ❌ | ✅ WebP / AVIF |
| Lazy loading | Manual | ✅ Automatic |
| Prevents layout shift | ❌ | ✅ |
| Responsive sizing | Manual | ✅ |
| Performance | Baseline | Optimized |

---

## 💻 Practical Task

**Build a responsive photo gallery:**

1. Create `app/gallery/page.jsx` with a grid of images from Unsplash
2. Use `next/image` with `fill` mode for each photo card
3. Add `priority` to the first 3 images (above the fold)
4. Use Tailwind (or CSS Modules) for the grid layout
5. Add a custom Google Font (e.g. `Playfair_Display`) to just the gallery heading
6. Create a `Badge` component using CSS Modules for an "New" label on some photos
7. Add the Unsplash domain to `next.config.js`

---

## ✅ End-of-Day Quiz

**Q1.** What is the main benefit of CSS Modules over regular CSS?

**Q2.** What does `next/font` do differently from a standard `<link>` to Google Fonts?

**Q3.** Why should you use `next/image` instead of a plain `<img>` tag?

**Q4.** When should you add the `priority` prop to an `<Image>` component?

**Q5.** What must you configure in `next.config.js` to use images from external URLs?

**Q6.** What does `display: 'swap'` mean in font configuration?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** CSS Modules scope class names to the component file, preventing naming collisions. The build process transforms `.button` into a unique string like `Button_button__xK7dQ`.

**A2.** `next/font` downloads and self-hosts font files at build time. There's no runtime request to Google's servers — better privacy, faster load, no CORS issues, and zero layout shift.

**A3.** `next/image` automatically converts images to modern formats (WebP/AVIF), resizes them for the device, lazy loads them, and reserves space to prevent Cumulative Layout Shift (CLS). A plain `<img>` does none of this.

**A4.** Add `priority` to images that are visible immediately on page load (above the fold) — typically hero images, profile avatars at the top, or any LCP (Largest Contentful Paint) candidate. This preloads the image and improves Core Web Vitals.

**A5.** Add the hostname to `images.remotePatterns` in `next.config.js`. Without this, Next.js will refuse to optimize images from that domain as a security measure.

**A6.** `display: 'swap'` means the browser shows a fallback font immediately while the custom font loads, then swaps it in. This prevents invisible text during font load (FOIT) and is good for Core Web Vitals.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
