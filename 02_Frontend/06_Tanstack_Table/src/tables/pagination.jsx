import { useState } from "react"

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { columns, studentlist } from './dataHelper'

function PaginatedTable() {
    const table = useReactTable({
        data: studentlist,
        columns,

        initialState: {
            pagination: {
                pageSize: 25,
            },
        },

        getCoreRowModel: getCoreRowModel(),

        getPaginationRowModel:
            getPaginationRowModel(),
    })

    return (
            <div className="h-full flex flex-col border">

                {/* PAGINATION */}
                <div className="flex flex-row justify-end">
                    <div className="flex items-center gap-2 p-4 border-t">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="border px-3 py-1 disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="border px-3 py-1 disabled:opacity-50"
                        >
                            Next
                        </button>

                        <span className="ml-4">
                            Page{" "}
                            {table.getState().pagination.pageIndex + 1}
                            {" / "}
                            {table.getPageCount()}
                        </span>
                    </div>
                </div>

                {/* TABLE */}
                <div className="flex-1 overflow-auto px-2">
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 bg-orange-200">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="border p-2 text-left"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
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

export default PaginatedTable