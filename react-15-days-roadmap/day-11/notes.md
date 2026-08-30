# Day 11 - Styling with Tailwind CSS

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] Tailwind CSS setup with Vite
- [ ] Utility classes basics
- [ ] Flexbox & Grid in Tailwind
- [ ] Responsive design (sm, md, lg)
- [ ] Dark mode
- [ ] Hover & focus states
- [ ] Reusable component styling

---

## Key Concepts
```jsx
// Layout
<div className="flex items-center justify-between p-4">

// Responsive
<div className="text-sm md:text-base lg:text-lg">

// Hover
<button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded">

// Dark mode
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">

// Conditional classes
<div className={`p-4 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}>
```

---

## Practice Task
- [ ] Style your Day 04 login form with Tailwind
- [ ] Build a responsive navbar
- [ ] Build a user card with avatar, name, role

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://tailwindcss.com/docs

---

## Interview Questions

**Q1. What is Tailwind CSS and how is it different from regular CSS?**
> Tailwind is a utility-first CSS framework. Instead of writing custom CSS classes, you apply pre-built utility classes directly in JSX. It speeds up styling and keeps styles co-located with components.

**Q2. What is the difference between Tailwind and Bootstrap?**
> Bootstrap provides pre-built components (buttons, cards, navbars). Tailwind provides low-level utility classes and you build your own components. Tailwind gives more flexibility and produces smaller CSS bundles.

**Q3. How do you apply conditional classes in Tailwind?**
> Use template literals or a library like `clsx`:
> ```jsx
> className={`btn ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
> // or with clsx
> className={clsx('btn', { 'bg-blue-500': isActive })}
> ```

**Q4. How does Tailwind handle responsive design?**
> Using breakpoint prefixes: `sm:`, `md:`, `lg:`, `xl:`. Example: `className="text-sm md:text-base lg:text-xl"` applies different sizes at different screen widths.

**Q5. How do you enable dark mode in Tailwind?**
> Set `darkMode: 'class'` in tailwind.config.js, then add the `dark` class to the html element. Use `dark:` prefix for dark mode styles: `className="bg-white dark:bg-gray-900"`.

**Q6. What is the JIT (Just-In-Time) mode in Tailwind?**
> JIT generates CSS on-demand as you write classes instead of generating a huge CSS file upfront. It results in faster builds and smaller CSS output. It's the default in Tailwind v3.
