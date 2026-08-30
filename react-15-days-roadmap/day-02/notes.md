# Day 02 - Props

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] What are Props
- [ ] Passing props to components
- [ ] Receiving props
- [ ] Default props
- [ ] Props destructuring
- [ ] children prop

---

## Key Concepts
```jsx
// Passing props
<UserCard name="John" age={25} />

// Receiving props
function UserCard({ name, age }) {
  return <p>{name} is {age} years old</p>;
}

// Children prop
function Card({ children }) {
  return <div className="card">{children}</div>;
}
```

---

## Practice Task
- [ ] Build a UserCard component with name, age, role props
- [ ] Build a Card wrapper component using children prop
- [ ] Render a list of 3 users using the same component

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://react.dev/learn/passing-props-to-a-component

---

## Interview Questions

**Q1. What are props in React?**
> Props (properties) are read-only inputs passed from a parent component to a child component. They allow data to flow down the component tree.

**Q2. Can you modify props inside a component?**
> No. Props are immutable. A component should never modify its own props. If you need to change data, use state instead.

**Q3. What is the children prop?**
> `children` is a special prop that contains whatever is placed between the opening and closing tags of a component. It allows components to act as wrappers.

**Q4. What is prop drilling and why is it a problem?**
> Prop drilling is passing props through multiple layers of components just to reach a deeply nested child. It makes code hard to maintain. Solutions include useContext or Zustand.

**Q5. What is the difference between props and state?**
> Props are passed from parent to child and are read-only. State is managed inside the component and can be changed using setState or useState.

**Q6. How do you set default values for props?**
> Using default parameter values in destructuring: `function Card({ title = 'Default Title' })` or using `Component.defaultProps = {}`.
