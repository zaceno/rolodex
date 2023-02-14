import React, { useState, useEffect, useCallback } from "react"
const LS_LAST_SEARCH = "zach-rolodex-last-search"
const debounce = (fn: (...args: any[]) => any, delay: number) => {
  let debouncing: ReturnType<typeof setTimeout> | null = null
  return (...args: any[]) => {
    if (debouncing) clearTimeout(debouncing)
    debouncing = setTimeout(() => {
      fn(...args)
      debouncing = null
    }, delay)
  }
}

type SearchInputProps = {
  initialValue?: string
  onSearch: (str: string) => any
}

export function SearchInput({ initialValue = "", onSearch }: SearchInputProps) {
  let [search, setSearch] = useState<string>(initialValue)
  const doSearch = useCallback(
    debounce((search, onSearch) => {
      search = search.trim()
      search = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase()
      localStorage.setItem(LS_LAST_SEARCH, search)
      onSearch(search)
    }, 400),
    []
  )
  useEffect(() => {
    let lastSearch = localStorage.getItem(LS_LAST_SEARCH)
    if (lastSearch) setSearch(lastSearch)
  }, [])
  useEffect(() => doSearch(search, onSearch), [search])
  return (
    <input
      type="text"
      value={search}
      onInput={ev => setSearch((ev.target as HTMLInputElement).value)}
    />
  )
}
