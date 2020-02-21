import React, { useState, useEffect, useRef } from 'react'
import Table from './table/Table'
import Styles from '../styles'
import parseFactura from '../parseFactura'
import tableColumns from './table/columns'

function MyForm() {
    const [facturasData, setFacturasData] = useState()
    const [files, setFiles] = useState([])
    const [hideFilters, setHideFilters] = useState(false)
    const prevFilesRef = useRef()
    useEffect(() => {
        prevFilesRef.current = files
    })
    const prevFiles = prevFilesRef.current

    const columns = React.useMemo(
        () => tableColumns,
        []
    )

    if (files.length > 0 && prevFiles !== files) {
        const xmlPromises = []
        files.forEach(file => {
            xmlPromises.push(file.text())
        })
        Promise.all(xmlPromises).then(xmlData => {
            setFacturasData(parseFactura(xmlData))
        })
    }

    const renderRowSubComponent = React.useCallback(
        ({ row }) => (
            <pre
                style={{
                    fontSize: "10px"
                }}
            >
                <div>{console.log(row)}{JSON.stringify({...row.original.conceptos}, null, "\t")}</div>
            </pre>
        ),
        []
    )

    return (
        <Styles>
            <span>
                <input
                    type="file"
                    id="files"
                    multiple
                    onChange={e => setFiles(Array.from(e.target.files))}
                />
                {
                    facturasData &&
                    <label>
                        Hide filters?
                        <input
                            type="checkbox"
                            label="Hide Filters?"
                            value="false"
                            onChange={() => setHideFilters(!hideFilters)}
                        />
                    </label>
                }
            </span>
            {facturasData &&
                <Table
                    columns={columns}
                    data={facturasData}
                    hideFilters={hideFilters}
                    renderRowSubComponent={renderRowSubComponent}
                />}
        </Styles>
    )
}

export default MyForm