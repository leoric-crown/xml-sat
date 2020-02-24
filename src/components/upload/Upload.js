import React, { useState, useEffect, useRef } from "react"
import Dropzone from "./dropzone/Dropzone"
import Progress from "./progress/Progress"

import { IconContext } from "react-icons"
import { FaCheck } from 'react-icons/fa'
import "./Upload.css"
import { request } from "http"



function Upload() {
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({})
  const [success, setSuccess] = useState(false)

  const prevFilesRef = useRef()
  useEffect(() => {
    prevFilesRef.current = files
  })
  const prevFiles = prevFilesRef.current

  console.log('PROGRESS', JSON.stringify(progress, null, "\t"))

  function onAddFiles(files) {
    const uploadProgress = {}
    files.forEach(file => uploadProgress[file.name] = {
      state: 'pending',
      percentage: 0
    })
    setFiles(files)
    setProgress(uploadProgress)
  }

  async function uploadFiles() {
    setUploading(true)
    console.log('new upload files action', JSON.stringify(progress, null, "\t"))

    const promises = []
    files.forEach(file => promises.push(sendRequest(file)))

    try {
      const res = await Promise.all(promises)
      console.log('All requests responded:', res.map(r => r.responseText))
    } catch (e) {
      setUploading(false)
      // setSuccess(true)
    }
  }

  function sendRequest(file) {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest()

      req.upload.addEventListener('progress', event => {
        if (event.lengthComputable) {
          const copy = { ...progress }
          copy[file.name] = {
            state: 'pending',
            percentage: (event.loaded / event.total) * 100
          }
          setProgress(copy)

        }
      })

      req.upload.addEventListener('load', event => {
        const copy = { ...progress }
        copy[file.name] = { state: 'done', percentage: 100 }
        setProgress(copy)

        resolve(req)
      })

      req.upload.addEventListener('error', event => {
        const copy = { ...progress }
        copy[file.name] = { state: 'error', percentage: 0 }
        setProgress(copy)

        reject(req)
      })

      const formData = new FormData()
      formData.append('file', file, file.name)
      req.open('POST', 'http://localhost:5000/files/unzip')
      req.send(formData)
    })
  }

  function renderProgress(file) {
    const prog = progress[file.name]
    const iconColor = success ? 'rgba(103, 58, 183, 1)' : 'rgba(183, 155, 229,0.3)'
    if (uploading || success) {
      return (
        <IconContext.Provider value={{ color: iconColor, size: '0.8em', style: { paddingLeft: '0.2em' } }}>
          <div className="ProgressWrapper">
            <Progress progress={prog ? prog.percentage : 0} />
            <FaCheck />
          </div>
        </IconContext.Provider>
      )
    }
  }

  function renderActions() {
    if (success) {
      return (
        <button
          onClick={() => {
            setFiles([])
            setSuccess(false)
          }}
        >
          Clear
        </button>
      )
    } else {
      return (
        <button
          disabled={files.length < 0 || uploading}
          onClick={uploadFiles}
        >
          Upload
        </button>
      )
    }
  }

  return (
    <div className="Upload">
      <span className="Title">Upload Files</span>
      <div className="Content">
        <div>
          <Dropzone
            onFilesAdded={(e) => onAddFiles(Array.from(e.target.files))}
            disabled={uploading || success}
          />
        </div>
        <div className="Files">
          {files.map(file => {
            return (
              <div key={file.name} className="Row">
                <span className="Filename">{file.name}</span>
                {renderProgress(file)}
              </div>
            )
          })}
        </div>
      </div>
      <div className="Actions">{renderActions()}</div>
    </div>
  )
}

export default Upload