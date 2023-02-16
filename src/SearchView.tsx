import React, { useReducer, useEffect, useDeferredValue } from "react"
import { SortMode, SearchResult, searchNames } from "./db"
import { SearchResultsList } from "./SearchResultsList"
const LS_LAST_SEARCH = "zach-rolodex-last-search"
const LS_LAST_SORT = "zach-rolodex-last-sort"
const DEBOUNCE_DELAY = 200

type SearchViewState = {
  search: string
  sort: SortMode
  lastLoaded: boolean
  startDebouncedSearch: boolean
  debounceTimeout: null | ReturnType<typeof setTimeout>
  doSearch: boolean
  results: SearchResult[]
  error: boolean
}

const initialState: SearchViewState = {
  search: "",
  sort: SortMode.FLASC,
  lastLoaded: false,
  startDebouncedSearch: false,
  debounceTimeout: null,
  doSearch: false,
  results: [],
  error: false,
}

type SearchViewAction =
  | LoadLatestAction
  | GotResultsAction
  | GotErrorAction
  | SetSearchAction
  | SetSortAction
  | StartDebouncedSearchAction
  | EndDebouncedSearchAction
  | SearchStartedAction

type LoadLatestAction = {
  type: "load latest"
  sort: SortMode
  search: string
}

type GotResultsAction = {
  type: "got results"
  sort: SortMode
  search: string
  results: SearchResult[]
}
type GotErrorAction = {
  type: "got error"
  sort: SortMode
  search: string
}

type SetSearchAction = {
  type: "set search"
  search: string
}
type SetSortAction = {
  type: "set sort"
  sort: SortMode
}
type StartDebouncedSearchAction = {
  type: "start debounced search"
  timeout: ReturnType<typeof setTimeout>
}

type EndDebouncedSearchAction = {
  type: "end debounced search"
}

type SearchStartedAction = {
  type: "search started"
}

const reducer = (
  state: SearchViewState,
  action: SearchViewAction
): SearchViewState => {
  switch (action.type) {
    case "load latest":
      return {
        ...state,
        lastLoaded: true,
        search: action.search,
        sort: action.sort,
        doSearch: true,
      }
    case "got results":
      if (action.search !== state.search) return state
      return {
        ...state,
        doSearch: false,
        results: action.results,
      }
    case "got error":
      if (action.search !== state.search) return state
      return {
        ...state,
        doSearch: false,
        results: [],
        error: true,
      }
    case "set search":
      return {
        ...state,
        search: action.search,
        startDebouncedSearch: true,
      }
    case "set sort":
      return {
        ...state,
        sort: action.sort,
        startDebouncedSearch: true,
      }
    case "start debounced search":
      return {
        ...state,
        startDebouncedSearch: false,
        debounceTimeout: action.timeout,
      }
    case "end debounced search":
      return {
        ...state,
        debounceTimeout: null,
        doSearch: true,
      }
    case "search started":
      return {
        ...state,
        doSearch: false,
      }
    default:
      return state
  }
}

const effecter = (
  state: SearchViewState,
  dispatch: React.Dispatch<SearchViewAction>
) => {
  if (!state.lastLoaded) {
    dispatch({
      type: "load latest",
      search: localStorage.getItem(LS_LAST_SEARCH) || "",
      sort: +(localStorage.getItem(LS_LAST_SORT) || 0) as SortMode,
    })
  }

  if (state.doSearch) {
    localStorage.setItem(LS_LAST_SEARCH, state.search)
    localStorage.setItem(LS_LAST_SORT, "" + state.sort)
    dispatch({ type: "search started" })
    searchNames(state.search, state.sort)
      .then(results => {
        dispatch({
          type: "got results",
          results,
          search: state.search,
          sort: state.sort,
        })
      })
      .catch(_ => {
        dispatch({
          type: "got error",
          search: state.search,
          sort: state.sort,
        })
      })
  }

  if (state.startDebouncedSearch) {
    if (state.debounceTimeout) clearTimeout(state.debounceTimeout)
    dispatch({
      type: "start debounced search",
      timeout: setTimeout(() => {
        dispatch({
          type: "end debounced search",
        })
      }, DEBOUNCE_DELAY),
    })
  }
}

export function SearchView() {
  let [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => effecter(state, dispatch))
  let deferredResults = useDeferredValue(state.results)
  return (
    <main>
      <h1>Rolodex</h1>
      <label>
        <span className="label">Search:</span>
        <input
          autoFocus
          type="text"
          tabIndex={0}
          value={state.search}
          onInput={ev =>
            dispatch({
              type: "set search",
              search: (ev.target as HTMLInputElement).value,
            })
          }
        />
      </label>
      <label>
        <span className="label">Sort:</span>
        <select
          value={state.sort}
          tabIndex={1}
          onInput={ev => {
            dispatch({
              type: "set sort",
              sort: +(ev.target as HTMLSelectElement).value as SortMode,
            })
          }}
        >
          <option value={SortMode.FLASC}>Firstname Lastname, ascending</option>
          <option value={SortMode.FLDSC}>Firstname Lastname, descending</option>
          <option value={SortMode.LFASC}>Lastname, Firstname, ascending</option>
          <option value={SortMode.LFDSC}>
            Lastname, Firstname, descending
          </option>
        </select>
      </label>
      {state.error && (
        <p className="error">There was an error searching. Try again.</p>
      )}
      {deferredResults.length && (
        <SearchResultsList
          results={deferredResults}
          formal={
            state.sort === SortMode.LFASC || state.sort === SortMode.LFDSC
          }
        />
      )}
    </main>
  )
}
