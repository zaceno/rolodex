import "./SearchInput.css"

type SearchInputProps = {
  value: string
  onInput: (v: string) => any
  tabIndex?: number
  autoFocus?: boolean
}

export const SearchInput = (props: SearchInputProps) => {
  const { value, onInput, ...rest } = props

  return (
    <input
      className="searchInput"
      type="text"
      placeholder="Search"
      value={value}
      onInput={ev => onInput((ev.target as HTMLInputElement).value)}
      {...rest}
    />
  )
}
