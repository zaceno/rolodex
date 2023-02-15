import React, { useState } from "react"
import { SearchResult, searchNames } from "./db"
import { SearchInput } from "./SearchInput"

export function SearchView() {
  let [error, setError] = useState<boolean>(false)
  let [result, setResult] = useState<SearchResult[]>([])

  const handleSearch = async (s: string) => {
    try {
      setResult(await searchNames(s))
    } catch (e) {
      setError(true)
    }
  }

  return (
    <main>
      <h1>Rolodex</h1>
      <SearchInput onSearch={handleSearch} />
      {error && (
        <p className="error">There was an error searching. Try again.</p>
      )}
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
