// index.js — React's entry point
// ReactDOM.createRoot mounts the React app into the #root div in index.html
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // StrictMode helps catch bugs in development (renders twice intentionally)
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
