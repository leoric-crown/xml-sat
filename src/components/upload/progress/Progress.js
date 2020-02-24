import React, { useState } from "react"
import "./Progress.css"

function Progress(props) {
  // console.log(props.progress)
  const [state, setState] = useState({})
  return (
    <div className="ProgressBar">
        <div
          className="Progress"
          style={{ width: props.progress + "%" }}
        />
    </div>
  )
}

export default Progress;
