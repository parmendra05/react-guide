# Day 04 - Event Handling & Forms

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] onClick, onChange, onSubmit
- [ ] Event object (e)
- [ ] Controlled inputs
- [ ] Form handling
- [ ] Preventing default behavior

---

## Key Concepts
```jsx
// Event handling
<button onClick={() => console.log('clicked')}>Click</button>

// Controlled input
const [value, setValue] = useState('');
<input value={value} onChange={(e) => setValue(e.target.value)} />

// Form submit
function handleSubmit(e) {
  e.preventDefault();
  console.log(value);
}
<form onSubmit={handleSubmit}>...</form>
```

---

## Practice Task
- [ ] Build a login form (email + password)
- [ ] Validate fields before submit
- [ ] Show success/error message

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://react.dev/learn/responding-to-events

---

## Interview Questions

**Q1. What is the difference between controlled and uncontrolled components?**
> A controlled component has its form data managed by React state. An uncontrolled component stores its own data internally in the DOM and is accessed via refs. Controlled is preferred in React.

**Q2. Why do we call e.preventDefault() in form submit?**
> By default, form submission causes a full page reload. e.preventDefault() stops that behavior so we can handle the submission with JavaScript instead.

**Q3. How do you handle multiple form inputs with one state?**
> Use an object in state and update by field name:
> ```js
> const [form, setForm] = useState({ name: '', email: '' });
> setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
> ```

**Q4. What is the difference between onChange and onBlur?**
> `onChange` fires on every keystroke. `onBlur` fires when the input loses focus. onBlur is often used for validation after the user finishes typing.

**Q5. How do you pass arguments to an event handler?**
> Wrap it in an arrow function: `onClick={() => handleDelete(id)}`. Avoid calling the function directly like `onClick={handleDelete(id)}` as that executes immediately on render.

**Q6. What is synthetic event in React?**
> React wraps native browser events in a SyntheticEvent object to normalize behavior across different browsers. It has the same interface as native events.
