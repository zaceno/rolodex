import { useState, useEffect, useRef } from "react"
import "./ListContactCard.css"

type ListContactCardProps = {
  firstname: string
  lastname: string
  formal: boolean
  extra: string
  imageUrl: string
  navUrl: string
}

export const ListContactCard = (props: ListContactCardProps) => {
  let elemRef = useRef<HTMLDivElement>(null)
  let [active, setActive] = useState<boolean>(false)

  useEffect(() => {
    const activate = () => setActive(true)
    const deactivate = () => setActive(false)
    elemRef.current?.addEventListener("mousedown", activate)
    elemRef.current?.addEventListener("touchstart", activate)
    window.addEventListener("mouseup", deactivate)
    window.addEventListener("touchend", deactivate)
    return () => {
      elemRef.current?.removeEventListener("mousedown", activate)
      elemRef.current?.removeEventListener("touchstart", activate)
      window.removeEventListener("mouseup", deactivate)
      window.removeEventListener("touchend", deactivate)
    }
  }, [])

  const navigate = () => {
    console.log("NAVIGATIONG", props.navUrl)
    window.location.pathname = props.navUrl
  }

  const name = props.formal
    ? `${props.lastname}, ${props.firstname}`
    : `${props.firstname} ${props.lastname}`

  return (
    <div
      ref={elemRef}
      onClick={() => navigate()}
      onTouchStart={() => setActive(true)}
      onMouseDown={() => setActive(true)}
      className={"listContactCard" + (active ? " active" : "")}
    >
      <img
        className="listContactCard-image"
        alt={"portrait of " + name}
        src={props.imageUrl}
      />
      <div className="listContactCard-name">{name}</div>
      <div className="listContactCard-extra">{props.extra}</div>
    </div>
  )
}
