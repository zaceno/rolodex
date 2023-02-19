import { useState, useEffect } from "react"
import { SortMode } from "./db"
import "./SortDialog.css"

// This component represents both the sort-option button, as
// well as the dialog that pops up when activated.

type SortDialogProps = {
  sortMode: SortMode
  setSortMode: (mode: SortMode) => any
}

export const SortDialog = (props: SortDialogProps) => {
  let [sortOpen, setSortOpen] = useState<boolean>(false)

  const setNameOrder = (no: "FL" | "LF") => {
    if (no == "FL" && props.sortMode === SortMode.LFASC)
      props.setSortMode(SortMode.FLASC)
    if (no == "FL" && props.sortMode === SortMode.LFDSC)
      props.setSortMode(SortMode.FLDSC)
    if (no == "LF" && props.sortMode === SortMode.FLASC)
      props.setSortMode(SortMode.LFASC)
    if (no == "LF" && props.sortMode === SortMode.FLDSC)
      props.setSortMode(SortMode.LFDSC)
  }
  const setSortDirection = (d: "ASC" | "DSC") => {
    if (d === "ASC" && props.sortMode === SortMode.FLDSC)
      props.setSortMode(SortMode.FLASC)
    if (d === "ASC" && props.sortMode === SortMode.LFDSC)
      props.setSortMode(SortMode.LFASC)
    if (d === "DSC" && props.sortMode === SortMode.FLASC)
      props.setSortMode(SortMode.FLDSC)
    if (d === "DSC" && props.sortMode === SortMode.LFASC)
      props.setSortMode(SortMode.LFDSC)
  }

  // Set up top level capturing of mouse/touch events
  // so that the dialog will be closed when we try to interact
  // outside it
  useEffect(() => {
    const h = () => setSortOpen(false)
    document.addEventListener("mousedown", h)
    document.addEventListener("touchstart", h)
    return () => {
      document.removeEventListener("mousedown", h)
      document.removeEventListener("touchstart", h)
    }
  }, [])

  return (
    <>
      <div
        onMouseDown={ev => ev.stopPropagation()}
        onTouchStart={ev => ev.stopPropagation()}
        onClick={ev => setSortOpen(!sortOpen)}
        className={"sortDialogButton" + (sortOpen ? " active" : "")}
      >
        <span className="icon">swap_vert</span>
      </div>
      {sortOpen && (
        <div
          className="sortDialog"
          onMouseDown={ev => ev.stopPropagation()}
          onTouchStart={ev => ev.stopPropagation()}
        >
          <section className="sortDialog-column">
            <label>
              <span>Aaa Bbb</span>
              <input
                type="radio"
                name="nameorder"
                value="FL"
                checked={
                  props.sortMode === SortMode.FLASC ||
                  props.sortMode === SortMode.FLDSC
                }
                onChange={_ => setNameOrder("FL")}
              />
            </label>
            <label>
              <span>Bbb, Aaa</span>
              <input
                type="radio"
                name="nameorder"
                value="LF"
                checked={
                  props.sortMode === SortMode.LFASC ||
                  props.sortMode === SortMode.LFDSC
                }
                onChange={_ => setNameOrder("LF")}
              />
            </label>
          </section>
          <section className="sortDialog-column">
            <label>
              <span className="icon">arrow_upward</span>
              <input
                type="radio"
                name="direction"
                value="DSC"
                checked={
                  props.sortMode === SortMode.FLDSC ||
                  props.sortMode === SortMode.LFDSC
                }
                onChange={_ => setSortDirection("DSC")}
              />
            </label>
            <label>
              <span className="icon">arrow_downward</span>
              <input
                type="radio"
                name="direction"
                value="ASC"
                checked={
                  props.sortMode === SortMode.FLASC ||
                  props.sortMode === SortMode.LFASC
                }
                onChange={_ => setSortDirection("ASC")}
              />
            </label>
          </section>
        </div>
      )}
    </>
  )
}
