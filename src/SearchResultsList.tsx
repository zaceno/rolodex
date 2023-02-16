import { SearchResult } from "./db"
import { ListContactCard } from "./ListContactCard"
import "./SearchResultsList.css"

type SearchResultsListProps = {
  results: SearchResult[]
  formal: boolean
}

export const SearchResultsList = (props: SearchResultsListProps) => {
  return (
    <ul className="searchResultList">
      {props.results.map(person => (
        <li key={person.id}>
          <ListContactCard
            firstname={person.firstname}
            lastname={person.lastname}
            formal={props.formal}
            imageUrl={person.thumbnail}
            extra={person.phone1 || person.email}
            navUrl={"/" + person.id}
          />
        </li>
      ))}
    </ul>
  )
}
