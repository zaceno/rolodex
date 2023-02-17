import { useDeferredValue, useEffect, useState, useRef } from "react"
import { SortMode, SearchResult, searchNames } from "./db"
import { SearchResultsList } from "./SearchResultsList"
import { SearchInput } from "./SearchInput"
import { SortDialog } from "./SortDialog"
const LS_LAST_SEARCH = "zach-rolodex-last-search"
const LS_LAST_SORT = "zach-rolodex-last-sort"
const DEBOUNCE_DELAY = 200

export function SearchView() {
  let [search, setSearch] = useState<string>("")
  let [sort, setSort] = useState<SortMode>(SortMode.FLASC)
  let [error, setError] = useState<boolean>(false)
  let [results, setResults] = useState<SearchResult[]>([])
  // Give lower priority to results over input
  let deferredResults = useDeferredValue(results)

  //first render, make sure to load previous search/sort settings
  useEffect(() => {
    const search = localStorage.getItem(LS_LAST_SEARCH) || ""
    const sort = +(
      localStorage.getItem(LS_LAST_SORT) || SortMode.FLASC
    ) as SortMode
    setSearch(search)
    setSort(sort)
  }, [])

  // Effect for searching when search and sort changes
  // Lots of protections against performance wasters
  //  - debounce searching while typing
  //  - ignore search results that come back for earlier results
  //  - don't search for empty string - just use empty result
  const lastSearchParams = useRef({
    search: "",
    sort: SortMode.FLASC,
  })
  const [debounceTimeout, setDebounceTimeout] =
    useState<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout)
    setDebounceTimeout(
      setTimeout(() => {
        setDebounceTimeout(null)
        localStorage.setItem(LS_LAST_SEARCH, search)
        localStorage.setItem(LS_LAST_SORT, "" + sort)
        setResults([])
        setError(false)
        if (search.length < 1) return
        lastSearchParams.current = { search, sort }
        searchNames(search, sort)
          .then(results => {
            if (
              lastSearchParams.current.search !== search ||
              lastSearchParams.current.sort !== sort
            )
              return
            setResults(results)
          })
          .catch(e => {
            if (
              lastSearchParams.current.search !== search ||
              lastSearchParams.current.sort !== sort
            )
              return
            setError(true)
          })
      }, DEBOUNCE_DELAY)
    )
  }, [search, sort])

  return (
    <main>
      <header>
        <h1>ACME Inc. Rolodex</h1>
        <SearchInput
          tabIndex={0}
          autoFocus
          value={search}
          onInput={setSearch}
        />
        <SortDialog sortMode={sort} setSortMode={setSort} />
      </header>
      {error && (
        <p className="error">There was an error searching. Try again.</p>
      )}
      {deferredResults.length && (
        <SearchResultsList
          results={deferredResults}
          formal={sort === SortMode.LFASC || sort === SortMode.LFDSC}
        />
      )}
    </main>
  )
}
