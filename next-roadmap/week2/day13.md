# Day 13 — Testing in Next.js

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### Testing Strategy for Next.js

Testing in Next.js spans multiple levels. You don't need to test everything — focus on what's risky:

| Type | What it tests | Tool | Speed |
|------|--------------|------|-------|
| **Unit** | A single function or component in isolation | Vitest / Jest | ⚡ Very fast |
| **Integration** | Multiple units working together | Vitest + Testing Library | ⚡ Fast |
| **E2E** | Full user flows in a real browser | Playwright / Cypress | 🐢 Slow |

**Rule of thumb:** Write many unit tests, some integration tests, and a handful of critical E2E tests.

---

### Setup — Vitest + React Testing Library

Vitest is the recommended test runner for Next.js projects. It's faster than Jest and works natively with ESM.

```bash
npm install -D vitest @vitejs/plugin-react jsdom
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

#### `vitest.config.js`

```js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.js'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

#### `tests/setup.js`

```js
import '@testing-library/jest-dom';
```

#### `package.json` scripts

```json
{
  "scripts": {
    "test": "vitest --run",
    "test:watch": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

---

### Testing React Components

#### Testing a simple component

```jsx
// components/Badge.jsx
export default function Badge({ status }) {
  const styles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
  };

  return (
    <span className={styles[status] || 'bg-gray-100'}>
      {status}
    </span>
  );
}
```

```js
// __tests__/Badge.test.jsx
import { render, screen } from '@testing-library/react';
import Badge from '@/components/Badge';

describe('Badge', () => {
  it('renders the status text', () => {
    render(<Badge status="active" />);
    expect(screen.getByText('active')).toBeInTheDocument();
  });

  it('applies the correct class for active status', () => {
    render(<Badge status="active" />);
    const badge = screen.getByText('active');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('applies the correct class for inactive status', () => {
    render(<Badge status="inactive" />);
    expect(screen.getByText('inactive')).toHaveClass('bg-red-100');
  });
});
```

---

#### Testing User Interactions

```jsx
// components/Counter.jsx
'use client';
import { useState } from 'react';

export default function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);
  return (
    <div>
      <p data-testid="count">Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(c => c - 1)}>Decrement</button>
    </div>
  );
}
```

```js
// __tests__/Counter.test.jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from '@/components/Counter';

describe('Counter', () => {
  it('starts at the initial value', () => {
    render(<Counter initial={5} />);
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 5');
  });

  it('increments when Increment is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initial={0} />);
    await user.click(screen.getByText('Increment'));
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 1');
  });

  it('decrements when Decrement is clicked', async () => {
    const user = userEvent.setup();
    render(<Counter initial={3} />);
    await user.click(screen.getByText('Decrement'));
    expect(screen.getByTestId('count')).toHaveTextContent('Count: 2');
  });
});
```

---

#### Testing with Mocked Fetch

```js
// __tests__/PostsList.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import PostsList from '@/components/PostsList';

const mockPosts = [
  { id: 1, title: 'First Post' },
  { id: 2, title: 'Second Post' },
];

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mockPosts,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

it('renders a list of posts', async () => {
  render(<PostsList />);

  // Wait for async data to load
  await waitFor(() => {
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });
});

it('shows a loading state initially', () => {
  render(<PostsList />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

---

### Testing API Routes

```js
// __tests__/api/posts.test.js
import { GET, POST } from '@/app/api/posts/route';

it('GET returns a list of posts', async () => {
  const request = new Request('http://localhost/api/posts');
  const response = await GET(request);
  const data = await response.json();

  expect(response.status).toBe(200);
  expect(Array.isArray(data)).toBe(true);
});

it('POST creates a new post', async () => {
  const request = new Request('http://localhost/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title: 'Test Post', content: 'Test content' }),
    headers: { 'Content-Type': 'application/json' },
  });

  const response = await POST(request);
  const data = await response.json();

  expect(response.status).toBe(201);
  expect(data.title).toBe('Test Post');
});
```

---

### Testing Utility Functions

Pure functions are the easiest to test — no rendering needed:

```js
// lib/formatDate.js
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}
```

```js
// __tests__/lib/formatDate.test.js
import { formatDate, truncate } from '@/lib/formatDate';

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    expect(formatDate('2024-01-15')).toBe('January 15, 2024');
  });
});

describe('truncate', () => {
  it('returns original text if within limit', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('truncates and adds ellipsis if over limit', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });
});
```

---

### E2E Testing with Playwright

Playwright tests the real app in a real browser — best for critical user flows.

```bash
npm install -D @playwright/test
npx playwright install
```

#### `playwright.config.js`

```js
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

#### Writing an E2E test

```js
// e2e/auth.spec.js
import { test, expect } from '@playwright/test';

test('user can sign in and see dashboard', async ({ page }) => {
  await page.goto('/auth/signin');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});

test('unauthenticated user is redirected from dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/auth/signin');
});
```

---

### Mocking Next.js Navigation Hooks

`useRouter`, `usePathname`, and `useSearchParams` come from `next/navigation`. Testing Library renders components in jsdom — not in a real Next.js app — so you must mock them:

```js
// __tests__/Navbar.test.jsx
import { render, screen } from '@testing-library/react';
import Navbar from '@/components/Navbar';

// Mock the entire next/navigation module
vi.mock('next/navigation', () => ({
  usePathname: vi.fn().mockReturnValue('/about'),
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}));

it('highlights the active link', () => {
  render(<Navbar />);
  const aboutLink = screen.getByRole('link', { name: /about/i });
  // Your Navbar uses usePathname to bold the active link
  expect(aboutLink).toHaveStyle({ fontWeight: 'bold' });
});
```

---

### Mocking `next/image` and `next/link`

These components have internal optimisation logic that can break in tests. Mock them with simple pass-throughs:

```js
// tests/setup.js  — add alongside jest-dom import
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }) => <img src={src} alt={alt} {...props} />,
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));
```

---

### Testing Server Actions

Server Actions are just async functions — test them like any other async function. Mock the database and Next.js cache functions:

```js
// __tests__/actions/createPost.test.js
import { createPost } from '@/app/actions/createPost';

// Mock Next.js server-only functions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

// Mock the database
vi.mock('@/lib/db', () => ({
  db: {
    posts: {
      create: vi.fn().mockResolvedValue({ id: 1, title: 'Test Post' }),
    },
  },
}));

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

it('creates a post and revalidates the cache', async () => {
  const formData = new FormData();
  formData.set('title', 'Test Post');
  formData.set('content', 'This is the content of the post.');

  await createPost(formData);

  expect(revalidatePath).toHaveBeenCalledWith('/posts');
  expect(redirect).toHaveBeenCalledWith('/posts');
});

it('returns validation errors for invalid input', async () => {
  const formData = new FormData();
  formData.set('title', 'Hi'); // too short — fails min(3)
  formData.set('content', 'Short');

  const result = await createPost(formData);

  expect(result.error).toBeDefined();
  expect(result.error.title).toBeDefined();
});
```

---

### Mock Service Worker (MSW) — Better API Mocking

Instead of mocking `global.fetch`, MSW intercepts requests at the network level — much closer to reality:

```bash
npm install -D msw
```

```js
// tests/mocks/handlers.js
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/posts', () => {
    return HttpResponse.json([
      { id: 1, title: 'First Post' },
      { id: 2, title: 'Second Post' },
    ]);
  }),

  http.post('/api/posts', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: 3, ...body }, { status: 201 });
  }),
];
```

```js
// tests/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

```js
// tests/setup.js
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Start MSW before all tests
beforeAll(() => server.listen());
// Reset handlers between tests
afterEach(() => server.resetHandlers());
// Clean up after all tests
afterAll(() => server.close());
```

Now your component tests use the real `fetch` — no `global.fetch` mocking needed:

```js
it('renders posts from the API', async () => {
  render(<PostsList />);
  expect(await screen.findByText('First Post')).toBeInTheDocument();
  expect(screen.getByText('Second Post')).toBeInTheDocument();
});
```

---

### Accessibility Testing with `axe`

Catch WCAG violations automatically in your component tests:

```bash
npm install -D @axe-core/react vitest-axe
```

```js
// __tests__/accessibility.test.jsx
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import 'vitest-axe/extend-expect';
import ContactForm from '@/components/ContactForm';

it('has no accessibility violations', async () => {
  const { container } = render(<ContactForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

Common violations axe catches: missing `alt` text, unlabelled form inputs, insufficient colour contrast, missing landmark roles.

---

## 💻 Practical Task

**Add tests to the Week 1 blog project:**

1. Set up Vitest + React Testing Library following the config above
2. Write unit tests for any utility functions you have (e.g., date formatting, truncation)
3. Write a component test for your `Navbar` — check all links render
4. Write a test for your `GET /api/posts` route handler
5. Mock `fetch` and write an integration test for a component that fetches data
6. (Bonus) Write one Playwright E2E test — visit `/blog`, click the first post, verify the post title appears

---

## ✅ End-of-Day Quiz

**Q1.** What is the difference between unit and integration tests?

**Q2.** Why is `userEvent` preferred over `fireEvent` in Testing Library?

**Q3.** How do you test an async component that fetches data?

**Q4.** What does `vi.fn()` do in Vitest?

**Q5.** When should you write E2E tests vs unit tests?

**Q6.** What does `screen.getByRole` test that `getByTestId` doesn't?

**Q7.** How do you mock `useRouter` and `usePathname` in a component test?

**Q8.** What is the advantage of MSW over mocking `global.fetch` directly?

**Q9.** How do you test a Server Action?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** Unit tests test a single function or component in complete isolation with all dependencies mocked. Integration tests test how multiple units work together — e.g., a form component + its submission handler + an API route.

**A2.** `userEvent` simulates full browser interactions (keyboard typing, mouse movements, focus events) just like a real user. `fireEvent` just fires the DOM event — it doesn't simulate the full browser sequence. `userEvent` catches more real-world bugs.

**A3.** Use `waitFor()` or `findBy*` queries from Testing Library. These wait until the element appears in the DOM (polling until a timeout). Also mock `fetch` globally in `beforeEach` to control what data the component receives.

**A4.** `vi.fn()` creates a mock function that records calls, arguments, and return values. You can configure it with `.mockReturnValue()` or `.mockResolvedValue()` and later assert how many times it was called with `expect(fn).toHaveBeenCalledWith(...)`.

**A5.** Write unit tests for logic-heavy code and E2E tests for the most critical user flows (sign-in, checkout, form submission). E2E tests are slow and brittle — don't use them to test every component. Unit tests can't catch integration bugs — they test parts in isolation.

**A6.** `getByRole` queries by ARIA role (button, heading, link, textbox) — this tests that your UI is semantically correct and accessible. `getByTestId` relies on artificial `data-testid` attributes that real users and screen readers don't interact with. `getByRole` is the preferred approach.

**A7.** Use `vi.mock('next/navigation', () => ({ useRouter: vi.fn().mockReturnValue({ push: vi.fn() }), usePathname: vi.fn().mockReturnValue('/your-path') }))` at the top of your test file. This replaces the entire module for that test file.

**A8.** MSW intercepts requests at the network level — your component uses the real `fetch` function, making tests closer to real browser behaviour. Mocking `global.fetch` replaces the entire function, which can hide bugs where the fetch call itself is wrong (wrong URL, missing headers, etc.).

**A9.** Server Actions are plain async functions — import them and call them directly in tests. Mock `next/cache` (`revalidatePath`, `revalidateTag`) and `next/navigation` (`redirect`) with `vi.mock()`, mock your database, then call the action with a real `FormData` object and assert on the mocked functions.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
