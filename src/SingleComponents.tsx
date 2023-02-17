import { useState } from "react"
import { SortMode } from "./db"
import { SearchResultsList } from "./SearchResultsList"
import { SearchInput } from "./SearchInput"
import { SortDialog } from "./SortDialog"

export function SingleComponents() {
  let [search, setSearch] = useState<string>("")
  let [sortMode, setSortMode] = useState<SortMode>(SortMode.FLASC)

  return (
    <main>
      <header>
        <h1>ACME Inc. Rolodex</h1>
        <SearchInput value={search} onInput={setSearch} />
        <SortDialog sortMode={sortMode} setSortMode={setSortMode} />
      </header>

      <SearchResultsList
        formal={false}
        results={[
          {
            firstname: "Dozer",
            lastname: "Jackson",
            phone1: "(321) 555-1234",
            email: "alpha_dozer_stacks@yahoo.com",
            thumbnail: "https://randomuser.me/api/portraits/thumb/men/59.jpg",
            id: "123",
          },
          {
            firstname: "Sven",
            lastname: "Horstenbecker",
            phone1: "0702-123 98 55",
            email: "svenisback@gmail.com",
            thumbnail: "https://randomuser.me/api/portraits/thumb/men/52.jpg",
            id: "234",
          },
        ]}
      />
    </main>
  )
}
