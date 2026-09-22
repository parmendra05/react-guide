# Day 10 — Forms, Validation & Server Actions

## 📅 Daily Tracker

```
[ ] Concepts read
[ ] Code written
[ ] Practical task completed
[ ] Quiz answered
```

---

## 🧠 Concepts

### Forms in Next.js — Three Approaches

| Approach | Best for | Complexity |
|----------|----------|------------|
| Controlled components + `useState` | Simple forms | Low |
| React Hook Form | Complex forms, validation | Medium |
| Server Actions | Direct DB mutations, progressive enhancement | Medium |

---

### 1. Controlled Form (Basic)

```jsx
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? 'success' : 'error');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      <textarea name="message" value={form.message} onChange={handleChange} />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Sending...' : 'Send'}
      </button>
      {status === 'success' && <p>Message sent!</p>}
      {status === 'error' && <p>Something went wrong.</p>}
    </form>
  );
}
```

---

### 2. React Hook Form + Zod Validation

React Hook Form reduces re-renders and provides great validation. Zod gives you schema-based validation shared between client and server.

```bash
npm install react-hook-form zod @hookform/resolvers
```

#### Define your schema (reusable on client + server)

```js
// lib/schemas/contactSchema.js
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(500),
});
```

#### Build the form

```jsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from '@/lib/schemas/contactSchema';

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('name')} placeholder="Name" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <textarea {...register('message')} placeholder="Message" />
        {errors.message && <p className="text-red-500">{errors.message.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
}
```

---

### 3. Server Actions

Server Actions are async functions that run **on the server** but can be called directly from a form or a Client Component. No API route needed.

They are the modern Next.js approach for form submissions that write to a database.

#### Inline Server Actions (defined inside a Server Component)

The simplest way — define the action directly in the page:

```jsx
// app/posts/new/page.jsx — Server Component
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default function NewPostPage() {
  // Inline async function marked with 'use server'
  async function createPost(formData) {
    'use server'; // ← inline directive

    const title = formData.get('title');
    const content = formData.get('content');

    if (!title || !content) return; // basic guard

    await db.posts.create({ data: { title, content } });
    revalidatePath('/posts');
    redirect('/posts');
  }

  return (
    <form action={createPost}>
      <input name="title" placeholder="Title" required />
      <textarea name="content" placeholder="Content" required />
      <button type="submit">Publish</button>
    </form>
  );
}
```

#### Server Action in a separate file (for reuse)

```js
// app/actions/createPost.js
'use server'; // ← file-level directive — all exports are Server Actions

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

export async function createPost(formData) {
  const raw = {
    title: formData.get('title'),
    content: formData.get('content'),
  };

  const result = postSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  await db.posts.create(result.data);
  revalidatePath('/posts');
  redirect('/posts');
}
```

---

#### `bind()` — Pre-populating Server Action Arguments

When editing an existing item, use `.bind()` to pass the ID to the action before the form submits:

```jsx
// app/posts/edit/[id]/page.jsx — Server Component
import { updatePost } from '@/app/actions/updatePost';

export default async function EditPostPage({ params }) {
  const post = await getPost(params.id);

  // Pre-bind the id — it becomes the first arg of updatePost
  const updatePostWithId = updatePost.bind(null, params.id);

  return (
    <form action={updatePostWithId}>
      <input name="title" defaultValue={post.title} />
      <textarea name="content" defaultValue={post.content} />
      <button type="submit">Save Changes</button>
    </form>
  );
}
```

```js
// app/actions/updatePost.js
'use server';

export async function updatePost(id, formData) {
  // id comes from .bind(), formData from the form submission
  const title = formData.get('title');
  await db.posts.update({ where: { id }, data: { title } });
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}
```

---

#### File Upload with Server Actions

```js
// app/actions/uploadAvatar.js
'use server';

export async function uploadAvatar(formData) {
  const file = formData.get('avatar'); // returns a File object

  if (!file || file.size === 0) {
    return { error: 'No file selected' };
  }

  if (file.size > 2 * 1024 * 1024) { // 2MB limit
    return { error: 'File too large (max 2MB)' };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save to disk or upload to cloud storage (e.g. AWS S3, Cloudinary)
  // await uploadToS3(buffer, file.name);

  return { success: true };
}
```

```jsx
// app/profile/page.jsx
import { uploadAvatar } from '@/app/actions/uploadAvatar';

export default function ProfilePage() {
  return (
    <form action={uploadAvatar} encType="multipart/form-data">
      <input type="file" name="avatar" accept="image/*" />
      <button type="submit">Upload</button>
    </form>
  );
}
```

---

#### Advanced Zod — `.refine()` and `.transform()`

```js
// lib/schemas/postSchema.js
import { z } from 'zod';

export const postSchema = z.object({
  title: z
    .string()
    .min(3, 'Title too short')
    .max(100, 'Title too long')
    .transform(val => val.trim()), // strip whitespace

  price: z
    .string()
    .transform(val => parseFloat(val)) // convert string → number
    .refine(val => val > 0, 'Price must be positive'), // custom rule

  slug: z
    .string()
    .refine(
      async (slug) => {
        const exists = await db.posts.findUnique({ where: { slug } });
        return !exists; // must be unique
      },
      'Slug already taken' // async validation
    ),
});
```

---

#### Server Actions with `useFormState` (pending + validation errors)

```jsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPost } from '@/app/actions/createPost';

// Separate component to use useFormStatus
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  );
}

export default function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, null);

  return (
    <form action={formAction}>
      <input name="title" placeholder="Title" />
      {state?.error?.title && <p>{state.error.title[0]}</p>}

      <textarea name="content" placeholder="Content" />
      {state?.error?.content && <p>{state.error.content[0]}</p>}

      <SubmitButton />
    </form>
  );
}
```

Update the Server Action to return errors instead of throwing:

```js
// app/actions/createPost.js
'use server';

export async function createPost(prevState, formData) {
  const result = postSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  await db.posts.create(result.data);
  revalidatePath('/posts');
  redirect('/posts');
}
```

---

### Optimistic Updates

Show the result immediately before the server confirms — makes the UI feel instant:

```jsx
'use client';

import { useOptimistic } from 'react';
import { toggleLike } from '@/app/actions/toggleLike';

export default function LikeButton({ postId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (currentLikes, delta) => currentLikes + delta
  );

  async function handleLike() {
    addOptimisticLike(1);        // update UI immediately
    await toggleLike(postId);    // then sync with server
  }

  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  );
}
```

---

## 💻 Practical Task

**Build a contact form + blog post creator:**

1. Create `app/contact/page.jsx` — a React Hook Form + Zod validated contact form that POSTs to `/api/contact`
2. Create `app/api/contact/route.js` — validates the body with the same Zod schema and returns success/error
3. Create `app/posts/new/page.jsx` — a form using a Server Action to create a post
4. Add `useFormState` for inline validation errors on the Server Action form
5. After successful post creation, redirect to `/posts` and use `revalidatePath` to refresh the list

---

## ✅ End-of-Day Quiz

**Q1.** What is the main advantage of React Hook Form over controlled components?

**Q2.** What does `'use server'` at the top of a file do?

**Q3.** How do you access form field values inside a Server Action?

**Q4.** What is `revalidatePath` used for in a Server Action?

**Q5.** What is the difference between `useFormState` and `useFormStatus`?

**Q6.** What makes Server Actions better than a traditional API route + fetch call for form submissions?

---

<details>
<summary>📖 Answers (click to reveal)</summary>

**A1.** React Hook Form uses uncontrolled inputs and only re-renders when necessary (on submit or blur), rather than on every keystroke. This dramatically reduces re-renders in large forms and gives built-in validation integration.

**A2.** `'use server'` marks all exported functions in that file as Server Actions — async functions that run on the server. They can be called from Client Components or used as `action` props on `<form>` elements.

**A3.** Server Actions receive a `FormData` object. Use `formData.get('fieldName')` to read each field's value.

**A4.** `revalidatePath('/path')` purges the Next.js cache for a specific route after a mutation. This ensures the next visit to that page shows fresh data instead of stale cached content.

**A5.** `useFormState` holds the return value (state) from a Server Action and wires a dispatch function as the form's `action`. `useFormStatus` is a hook used inside a `<form>` to read whether the form's Server Action is currently `pending` — used to disable submit buttons.

**A6.** Server Actions eliminate the need for a separate API route file. They run directly on the server, can access your database without an HTTP round trip, work without JavaScript (progressive enhancement), and integrate tightly with `useFormState` for inline error handling.

</details>

---

## 📝 Notes

> Use this space to write your own notes.

-
-
-
