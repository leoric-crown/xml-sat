import React, { useState } from "react";
import "./Dropzone.css";

function Dropzone(props) {
  const [state, setState] = useState({ hightlight: false })
  const fileInputRef = React.createRef()

  const { disabled, onFilesAdded } = props

  function openFileDialog() {
    if (disabled) return
    fileInputRef.current.click()
  }

  function onDragOver(event) {
    event.preventDefault()
        if(disabled) return
        setState({ hightlight: true })
  }

  function onDragLeave(event) {
    setState({ hightlight: false })
  }
  
  function onDrop(event) {
    event.preventDefault()
    if(disabled) return
    const files = event.dataTransfer.files
    if (onFilesAdded) {
      const array = fileListToArray(files)
      onFilesAdded(array)
    }
    setState({ hightlight: false })
  }

  function fileListToArray(list) {
    const array = []
    for (let i = 0; i< list.length; i++) {
      array.push(list.item(i))
    }
    return array
  }

  return (
    <div
      className={`Dropzone ${state.hightlight ? "Highlight" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openFileDialog}
      style={{ cursor: disabled ? "default" : "pointer" }}
    >
      <input
        ref={fileInputRef}
        className="FileInput"
        type="file"
        multiple
        onChange={onFilesAdded}
      />
      <img
        alt="upload"
        className="Icon"
        src="baseline-cloud_upload-24px.svg"
      />
      <span>Upload Files</span>
    </div>
  )
}
export default Dropzone;
