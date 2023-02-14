import React, { useState } from "react"
import { SearchResult, searchNames } from "./db"
import { SearchInput } from "./SearchInput"

export function SearchView() {
  let [result, setResult] = useState<SearchResult[]>([])
  return (
    <main>
      <h1>Rolodex</h1>
      <SearchInput
        onSearch={(s: string) => searchNames(s).then(x => setResult(x))}
      />
      <ul>
        {result.map(person => (
          <li key={person.id}>
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
