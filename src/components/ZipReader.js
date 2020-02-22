import React, { useState } from 'react'
import * as API from '../utils/api'

async function handleFiles(files) {
    const fileStreams = []
    files.forEach(file => {
        fileStreams.push(file.text())
    })
    Promise.all(fileStreams).then(streams => {
        const payload = {
            files: streams
        }
        return API.unzip(payload).then(response => {
            console.log(response)
            return response
        })
    })
    
    // return API.hello().then(res => {
    //     console.log(res)
    //     return res
    // })
}

function ZipReader() {
    const [files, setFiles] = useState()

    console.log(files)
    if(files && files.length > 0) {
        // const validExtension = new RegExp(/(.*?)\.(zip)$/, 'i')
        handleFiles(files)
    }



    return (
        <React.Fragment>
            <input
                type="file"
                id="files"
                onChange={e => setFiles(Array.from(e.target.files))}
            />
        </React.Fragment>
    )
}

export default ZipReader