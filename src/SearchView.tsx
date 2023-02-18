import { useDeferredValue, useEffect, useState, useRef } from "react"
import { SortMode, SearchResult, searchNames } from "./db"
import { SearchResultsList } from "./SearchResultsList"
import { SearchInput } from "./SearchInput"
import { SortDialog } from "./SortDialog"
import "./SearchView.css"
const LS_LAST_SEARCH = "zach-rolodex-last-search"
const LS_LAST_SORT = "zach-rolodex-last-sort"
const LS_LAST_SCROLL = "zach-rolodex-last-scroll"
const DEBOUNCE_DELAY = 200

export function SearchView() {
  let [search, setSearch] = useState<string>("")
  let [sort, setSort] = useState<SortMode>(SortMode.FLASC)
  let [error, setError] = useState<boolean>(false)
  let [results, setResults] = useState<SearchResult[] | null>(null)
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
  // Performance optimizations
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
        setResults(null)
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

  //Scroll restoration on return to search list from detail page
  useEffect(() => {
    let scrollMemo: number
    const handler = () => {
      scrollMemo = document.body.scrollTop
    }
    document.body.addEventListener("scroll", handler)
    return () => {
      if (scrollMemo) localStorage.setItem(LS_LAST_SCROLL, "" + scrollMemo)
      document.body.removeEventListener("scroll", handler)
    }
  }, [])

  // this resets the scroll tracking. Using it in the effect above breaks
  // the restoreScroll, so it needs to be called direclty when inputing
  // a new search or new sort
  const resetScroll = () => {
    localStorage.setItem(LS_LAST_SCROLL, "0")
  }
  // this function is passed as prop to result list becuase it is defferred
  const restoreScroll = () => {
    document.body.scrollTop = +(localStorage.getItem(LS_LAST_SCROLL) || 0)
  }

  return (
    <>
      <header>
        <h1>ACME Inc. Rolodex</h1>
        <SearchInput
          tabIndex={0}
          value={search}
          onInput={search => {
            setSearch(search)
            resetScroll()
          }}
        />
        <SortDialog
          sortMode={sort}
          setSortMode={sort => {
            setSort(sort)
            resetScroll()
          }}
        />
      </header>
      {error && (
        <p className="searchView-error">
          There was an error searching. Try again.
        </p>
      )}
      {deferredResults !== null && deferredResults?.length == 0 && (
        <p className="searchView-error">No results. Try a shorter search.</p>
      )}
      {deferredResults != null && deferredResults.length > 0 && (
        <SearchResultsList
          onFinishRender={restoreScroll}
          results={deferredResults}
          formal={sort === SortMode.LFASC || sort === SortMode.LFDSC}
        />
      )}
    </>
  )
}
