import { useEffect, useState } from "react"
import { SearchView } from "./SearchView"
import { DetailView } from "./DetailView"

function App() {
  let [id, setId] = useState<string>(
    window.location.hash.match(/^#(.+)$/)?.[1] || ""
  )
  useEffect(() => {
    const handler = () => {
      setId(window.location.hash.match(/^#(.+)$/)?.[1] || "")
    }
    window.addEventListener("hashchange", handler)
    return () => {
      window.removeEventListener("hashchange", handler)
    }
  }, [])

  return <main>{id ? <DetailView id={id} /> : <SearchView />}</main>
}

export default App
