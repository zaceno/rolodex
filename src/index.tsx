import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"

// Top level import of db here not strictly necessary, but serves to
// start syncing data from the api right away
import "./db.ts"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
