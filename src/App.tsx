import React from "react"
import { SearchView } from "./SearchView"
import { DetailView } from "./DetailView"

function App() {
  let id = window.location.pathname.match(/^\/(.+)$/)?.[1]
  if (!id) return SearchView()
  else return DetailView({ id })
}

export default App
