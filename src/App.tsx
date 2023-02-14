import React, { useState, useEffect } from "react"
import { SearchResult, searchNames } from "./db"
function App() {
  let [search, setSearch] = useState<string>("Rose")
  let [result, setResult] = useState<SearchResult[]>([])
  useEffect(() => {
    searchNames(search).then(x => setResult(x))
  }, [search])
  return (
    <main>
      <h1>Rolodex</h1>
      <input
        type="text"
        value={search}
        onInput={ev => setSearch((ev.target as HTMLInputElement).value)}
      />
      <ul>
        {result.map(person => (
          <li>
            <a href={`./${person.id}`}>
              <p>
                <img src={person.thumbnail} /> {person.firstname}{" "}
                {person.lastname}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
