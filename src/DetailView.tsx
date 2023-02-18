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

function nameString(contact: Person) {
  return [
    contact.title && contact.title + ".",
    contact.firstname,
    contact.lastname,
  ]
    .filter(x => !!x)
    .join(" ")
}

type DetailViewProps = {
  id: string
}

export function DetailView({ id }: DetailViewProps) {
  let [error, setError] = useState<boolean>(false)
  let [contact, setContact] = useState<Person>(defaultPerson)
  let [buttonActive, setButtonActive] = useState<boolean>(false)
  useEffect(() => {
    getDetails(id)
      .then(details => {
        setContact(details)
        setError(false)
      })
      .catch(e => {
        setError(true)
      })
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
        {error && (
          <p className="Error">
            There was an error. Please go back and try again
          </p>
        )}
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
      </div>
    </>
  )
}
