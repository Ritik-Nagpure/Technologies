import { useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { studentlist, columns } from './dataHelper'

function FilterTable() {
    const [columnFilters, setColumnFilters] = useState([])

    const table = useReactTable({
        data: studentlist,
        columns,

        state: {
            columnFilters,
        },

        onColumnFiltersChange: setColumnFilters,

        getCoreRowModel: getCoreRowModel(),

        getFilteredRowModel: getFilteredRowModel(),
    })

    return (
        <div className="h-screen p-4">
            <div className="h-full overflow-auto border">
                <table className="w-full border-collapse">
                    <thead className="sticky top-0 bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="bg-emerald-300">
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="border p-2 "
                                    >
                                        <div className="flex flex-col gap-2">
                                            <div>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </div>

                                            <input
                                                type="text"
                                                value={
                                                    header.column.getFilterValue() ?? ""
                                                }
                                                onChange={(e) =>
                                                    header.column.setFilterValue(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Filter..."
                                                className="border px-2 py-1 text-sm"
                                            />
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>

                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="border p-2"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default FilterTable