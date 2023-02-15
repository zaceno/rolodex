import React, {
  useState,
  useEffect,
  useRef,
  useDeferredValue,
  startTransition,
} from "react"
import { SearchResult, searchNames } from "./db"
const LS_LAST_SEARCH = "zach-rolodex-last-search"
const DEBOUNCE_DELAY = 200

const cleanSearch = (s: string) => {
  s = s.trim()
  if (s.length) s = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  return s
}

export function SearchView() {
  let [searchTerm, setSearchTerm] = useState<string>("")
  let [debounceTimeout, setDebounceTimeout] =
    useState<ReturnType<typeof setTimeout> | null>(null)
  let [error, setError] = useState<boolean>(false)
  let [results, setResults] = useState<SearchResult[]>([])
  let deferredResults = useDeferredValue(results)
  let lastSearch = useRef<string>("")

  const startSearching = (s: string) => {
    localStorage.setItem(LS_LAST_SEARCH, s)
    lastSearch.current = s
    searchNames(cleanSearch(s))
      .then(results => {
        if (lastSearch.current === s) startTransition(() => setResults(results))
      })
      .catch(e => {
        if (lastSearch.current === s) setError(true)
      })
  }

  const applySearchTerm = (s: string) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    setDebounceTimeout(
      setTimeout(() => {
        setDebounceTimeout(null)
        startSearching(s)
      }, DEBOUNCE_DELAY)
    )
    setSearchTerm(s)
    setError(false)
    setResults([])
  }

  useEffect(
    () => applySearchTerm(localStorage.getItem(LS_LAST_SEARCH) || ""),
    []
  )

  return (
    <main>
      <h1>Rolodex</h1>
      <input
        type="text"
        value={searchTerm}
        onInput={ev => applySearchTerm((ev.target as HTMLInputElement).value)}
      />
      {error && (
        <p className="error">There was an error searching. Try again.</p>
      )}
      <ul>
        {deferredResults.map(person => (
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
