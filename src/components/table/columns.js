import React from 'react'

function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
}) {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

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

const columns = [
    {
        id: 'expander',
        Header: '',
        Cell: ({ row }) => {
            return (
                <span {...row.getToggleRowExpandedProps()}>
                    {row.isExpanded ? '👇' : '👉'}
                </span>
            )
        }
        ,
    },
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
        accessor: 'subtotal',
        disableFilters: true
    },
    {
        Header: 'IVA Trasladado',
        accessor: 'ivaTrasladado',
        disableFilters: true
    },
    {
        Header: 'Total',
        accessor: 'total',
        disableFilters: true
    },
    {
        Header: 'Efecto',
        accessor: 'efecto',
        Filter: SelectColumnFilter,
        filter: 'includes'
    }
]

export default columns