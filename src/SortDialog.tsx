import { useState } from "react"
import { SortMode } from "./db"
import "./SortDialog.css"

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
  return (
    <>
      <div
        className={"sortDialogButton" + (sortOpen ? " active" : "")}
        onClick={() => setSortOpen(true)}
      >
        <span className="icon">swap_vert</span>
      </div>
      {sortOpen && (
        <>
          <div
            className="sortDialog-backfilm"
            onClick={() => setSortOpen(false)}
          ></div>
          <div className="sortDialog">
            <table>
              <tr>
                <td>
                  <label>
                    Fn Ln{" "}
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
                </td>
                <td>
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
                </td>
              </tr>
              <tr>
                <td>
                  <label>
                    Ln, Fn{" "}
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
                </td>
                <td>
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
                </td>
              </tr>
            </table>
          </div>
        </>
      )}
    </>
  )
}
