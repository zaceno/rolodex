import { useState, useEffect } from "react"
import { Person, getDetails } from "./db"
import "./DetailView.css"
const defaultPerson: Person = {
  id: "",
  firstname: "",
  lastname: "",
  title: "",
  email: "",
  phone1: "",
  phone2: "",
  address1: "",
  address2: "",
  address3: "",
  thumbnail: "",
  portrait: "",
}

// Combines title and names into single presentation-string
function nameString(contact: Person) {
  return [
    contact.title && contact.title + ".",
    contact.firstname,
    contact.lastname,
  ]
    .filter(x => !!x)
    .join(" ")
}

export function DetailView({ id }: { id: string }) {
  // tracks if we got an error from db for the given id
  let [error, setError] = useState<boolean>(false)

  // holds the result from db for given id
  let [contact, setContact] = useState<Person>(defaultPerson)

  // Tracks the back-button active state
  let [buttonActive, setButtonActive] = useState<boolean>(false)

  // Given an id in props, fetch the person from db
  useEffect(() => {
    getDetails(id)
      .then(details => setContact(details))
      .catch(e => setError(true))
  }, [])

  return (
    <>
      <header>
        <h1>ACME Inc. Rolodex</h1>
        <div
          className={"detailBackButton" + (buttonActive ? " active" : "")}
          onMouseDown={() => setButtonActive(true)}
          onClick={() => {
            window.history.back()
          }}
        >
          <span className="icon">arrow_left</span>
        </div>
      </header>
      <div className="detailContactCard">
        {error ? (
          <p className="error">
            There was an error. Please go back and try again
          </p>
        ) : (
          <>
            <img src={contact.portrait} alt={nameString(contact)} />
            <dl>
              <dt className="dtName">Name:</dt>
              <dd className="ddName">{nameString(contact)}</dd>
              <dt className="dtEmail">E-mail:</dt>
              <dd className="ddEmail">{contact.email}</dd>
              <dt className="dtPhone">Phone:</dt>
              <dd className="ddPhone">
                {contact.phone1}
                <br />
                {contact.phone2}
              </dd>
              <dt className="dtAddress">Address:</dt>
              <dd className="ddAddress">
                {contact.address1}
                <br />
                {contact.address2}
                <br />
                {contact.address3}
              </dd>
            </dl>
          </>
        )}
      </div>
    </>
  )
}
