# Day 09 - Axios & API Integration

## Status: ⬜ Not Started
## Date: ___________
## Score: ___/10

---

## Topics
- [ ] Axios vs Fetch
- [ ] GET request
- [ ] POST request
- [ ] PUT / DELETE request
- [ ] Axios interceptors
- [ ] Base URL config
- [ ] Error handling

---

## Key Concepts
```jsx
import axios from 'axios';

// Base config
const api = axios.create({ baseURL: 'https://api.example.com' });

// GET
const { data } = await api.get('/users');

// POST
await api.post('/users', { name: 'John' });

// PUT
await api.put('/users/1', { name: 'Jane' });

// DELETE
await api.delete('/users/1');

// Interceptor (add token)
api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

## Practice Task
- [ ] Connect to your Spring Boot API or use JSONPlaceholder
- [ ] Fetch and display a list of items
- [ ] Add a new item via POST
- [ ] Delete an item via DELETE

---

## My Notes
> Write your notes here...

---

## Difficulties
> What was hard today?

---

## Resources
- https://axios-http.com/docs/intro

---

## Interview Questions

**Q1. What is the difference between Axios and Fetch?**
> Axios automatically parses JSON, handles errors for non-2xx status codes, supports request/response interceptors, and has better browser compatibility. Fetch requires manual JSON parsing and doesn't throw on 4xx/5xx errors.

**Q2. How do you handle errors in Axios?**
> Wrap in try/catch with async/await, or use `.catch()`. Axios throws an error for any non-2xx response, accessible via `error.response.data` and `error.response.status`.

**Q3. What are Axios interceptors?**
> Interceptors run before a request is sent or after a response is received. Common use: automatically attach JWT token to every request, or redirect to login on 401 response.

**Q4. How do you cancel an API request in React?**
> Use AbortController with fetch, or `axios.CancelToken`. Cancel in the useEffect cleanup function to avoid updating state on unmounted components.

**Q5. What is CORS and how does it affect React apps?**
> CORS (Cross-Origin Resource Sharing) is a browser security policy that blocks requests to a different domain. The backend (your Spring Boot API) must allow the React app's origin in its CORS config.

**Q6. How do you send a JWT token with every Axios request?**
> Use an Axios interceptor:
> ```js
> api.interceptors.request.use(config => {
>   config.headers.Authorization = `Bearer ${token}`;
>   return config;
> });
> ```
