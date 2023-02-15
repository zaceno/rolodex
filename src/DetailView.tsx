import React, { useState, useEffect } from "react"
import { Person, getDetails } from "./db"

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
    <main>
      {error && (
        <p className="Error">
          There was an error. Please go back and try again
        </p>
      )}
      <img src={contact.portrait} alt={nameString(contact)} />
      <dl>
        <dt>Name:</dt>
        <dd>{nameString(contact)}</dd>
        <dt>E-mail:</dt>
        <dd>{contact.email}</dd>
        <dt>Phone:</dt>
        <dd>
          {contact.phone1}
          <br />
          {contact.phone2}
        </dd>
        <dt>Address:</dt>
        <dd>
          {contact.address1}
          <br />
          {contact.address2}
          <br />
          {contact.address3}
        </dd>
      </dl>
    </main>
  )
}
