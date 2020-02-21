import React, { useState, useEffect, useRef } from 'react'
import XMLParser from 'react-xml-parser'
import Table from './Table'
import moment from 'moment'
import decode from 'decode-html'

function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
        <select
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    )
}

const xmlParser = new XMLParser()
const columns = [
    {
        Header: 'Emisor',
        accessor: 'emisor',
        filter: 'fuzzyText'
    },
    {
        Header: 'RFC',
        accessor: 'rfc'
    },
    {
        Header: 'Fecha de Emision',
        accessor: 'fecha'
    },
    {
        Header: 'Subtotal',
        accessor: 'subtotal'
    },
    {
        Header: 'IVA Trasladado',
        accessor: 'ivaTrasladado'
    },
    {
        Header: 'Total',
        accessor: 'total'
    },
    {
        Header: 'Efecto',
        accessor: 'efecto',
        Filter: SelectColumnFilter,
        filter: 'includes'
    }
]
function parseResults(results) {
    const jsonData = []
    results.forEach(xml => {
        const jsonParse = xmlParser.parseFromString(xml)
        const { attributes, children } = jsonParse
        const { SubTotal, Total, Fecha } = attributes
        const fecha = moment(Fecha).format('DD/MM/YYYY h:mm:ss a')
        const emisorXml = children.find(obj => {
            return obj.name === 'cfdi:Emisor'
        })
        const emisor = decode(emisorXml.attributes.Nombre)
        const rfc = emisorXml.attributes.Rfc
        const impuestos = children.find(obj => {
            return obj.name === 'cfdi:Impuestos'
        })
        var traslados
        if (impuestos) {
            traslados = impuestos.children.find(obj => obj.name === 'cfdi:Traslados')
            if (traslados) {
                const iva = traslados.children.find(obj => {
                    return obj.name === 'cfdi:Traslado' && obj.attributes.Impuesto === '002'
                })
                if (iva) traslados.iva = iva.attributes.Importe
            }
        }
        var efecto = ''
        switch (attributes.TipoDeComprobante) {
            case 'I':
                efecto = 'Ingreso'
                break
            case 'E':
                efecto = 'Egreso'
                break
            default:
                efecto = 'N/A'
                break
        }

        const json = {
            total: Total,
            subtotal: SubTotal,
            fecha,
            emisor,
            rfc,
            efecto,
            ivaTrasladado: traslados && traslados.iva ? traslados.iva : 0
        }
        jsonData.push(json)
    })
    return jsonData
}
function MyForm() {
    const [jsonData, setJsonData] = useState()
    const [files, setFiles] = useState([])
    const prevFilesRef = useRef()
    useEffect(() => {
        prevFilesRef.current = files
    })
    const prevFiles = prevFilesRef.current

    if (files.length > 0 && prevFiles !== files) {
        const xmlPromises = []
        files.forEach(file => {
            xmlPromises.push(file.text())
        })
        Promise.all(xmlPromises).then(xmlData => {
            setJsonData(parseResults(xmlData))
        })
    }

    return (
        <React.Fragment>
            <input
                type="file"
                id="files"
                multiple
                onChange={e => setFiles(Array.from(e.target.files))}
            />
            {jsonData && <Table columns={columns} data={jsonData} />}
        </React.Fragment>
    )
}

export default MyForm