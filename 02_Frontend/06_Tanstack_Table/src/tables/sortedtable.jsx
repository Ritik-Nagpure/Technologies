import { useState } from "react"

import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { columns, studentlist } from "./dataHelper"

function SortedTable() {
    const [sorting, setSorting] = useState([])

    const table = useReactTable({
        data: studentlist,
        columns,
        state: {
            sorting,
        },

        onSortingChange: setSorting,

        getCoreRowModel: getCoreRowModel(),
        
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <div className="h-full overflow-y-scroll border">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-blue-300">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className="border p-2 text-left cursor-pointer"
                                >
                                    <div className="flex items-center gap-2">
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}

                                        {{
                                            asc: "↑",
                                            desc: "↓",
                                        }[header.column.getIsSorted()] ?? ""}
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
    )
}

export default SortedTable