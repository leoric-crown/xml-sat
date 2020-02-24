import React from 'react'
import { useTable, useFilters, useSortBy, useExpanded } from 'react-table'
import matchSorter from 'match-sorter'


function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}
fuzzyTextFilterFn.autoRemove = val => !val

function Table({ columns, data, hideFilters, renderRowSubComponent }) {
    const filterTypes = React.useMemo(
        () => ({
            fuzzyText: fuzzyTextFilterFn,
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            }
        }),
        []
    )

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
        state: { expanded }
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes
        },
        useFilters,
        useSortBy,
        useExpanded
    )

    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>
                                <span {...column.getSortByToggleProps()}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
                                    {column.isSorted
                                        ? column.isSortedDesc
                                            ? ' 🔽'
                                            : ' 🔼'
                                        : ''}
                                </span>
                                {/* Render the columns filter UI */}
                                <div>{!hideFilters && column.canFilter ? column.render('Filter') : null}</div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <React.Fragment key={i}>
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                            {row.isExpanded ? (
                                <tr {...row.getRowProps()}>
                                    <td colSpan={visibleColumns.length}>
                                        {renderRowSubComponent({ row })}
                                    </td>
                                </tr>
                            ) : null }
                        </React.Fragment>

                    )
                })}
            </tbody>
        </table>
    )
}

export default Table