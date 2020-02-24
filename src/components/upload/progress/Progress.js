import React, { useState } from "react"
import "./Progress.css"

  function Progress(props) {
    const [state, setState ] = useState({})
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
