import "./SearchInput.css"

type SearchInputProps = {
  value: string
  onInput: (v: string) => any
  tabIndex?: number
}

export const SearchInput = (props: SearchInputProps) => {
  const { value, onInput, ...rest } = props

  return (
    <input
      autoFocus
      className="searchInput"
      type="text"
      placeholder="Search"
      value={value}
      onInput={ev => onInput((ev.target as HTMLInputElement).value)}
      {...rest}
    />
  )
}
