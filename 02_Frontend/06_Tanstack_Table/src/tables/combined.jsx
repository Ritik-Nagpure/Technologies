import { useState } from "react"

import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    createColumnHelper,
} from "@tanstack/react-table"

import { studentlist, columns } from "./dataHelper"


function App() {
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([]);

    const table = useReactTable({
        data: studentlist,

        columns,

        state: {
            sorting,
            columnFilters,
        },

        onSortingChange: setSorting,

        onColumnFiltersChange:
            setColumnFilters,

        // DEFAULT PAGE SIZE
        initialState: {
            pagination: {
                pageSize: 20,
            },
        },

        // ROW MODELS
        getCoreRowModel: getCoreRowModel(),

        getSortedRowModel:
            getSortedRowModel(),

        getFilteredRowModel:
            getFilteredRowModel(),

        getPaginationRowModel:
            getPaginationRowModel(),
    })

    return (
        <div className="h-screen p-4">
            <div className="h-full flex flex-col border rounded overflow-hidden">
                {/* PAGINATION */}
                <div className="border-t p-4 flex items-center gap-4 flex-wrap">

                    {/* PREV */}
                    <button
                        onClick={() =>
                            table.previousPage()
                        }
                        disabled={
                            !table.getCanPreviousPage()
                        }
                        className="border px-3 py-1 disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {/* NEXT */}
                    <button
                        onClick={() =>
                            table.nextPage()
                        }
                        disabled={!table.getCanNextPage()}
                        className="border px-3 py-1 disabled:opacity-50"
                    >
                        Next
                    </button>

                    {/* PAGE INFO */}
                    <span>
                        Page{" "}
                        <strong>
                            {table.getState().pagination
                                .pageIndex + 1}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {table.getPageCount()}
                        </strong>
                    </span>

                    {/* PAGE SIZE */}
                    <select
                        value={
                            table.getState().pagination
                                .pageSize
                        }
                        onChange={(e) =>
                            table.setPageSize(
                                Number(e.target.value)
                            )
                        }
                        className="border px-2 py-1"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>

                    {/* GO TO PAGE */}
                    <input
                        type="number"
                        min={1}
                        max={table.getPageCount()}
                        // defaultValue={1}
                        placeholder={'na'}
                        onChange={(e) => {
                            const page =
                                e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0

                            table.setPageIndex(page)
                        }}
                        className="border px-2 py-1 w-24"
                    />
                </div>

                {/* TABLE */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full border-collapse">

                        {/* HEADER */}
                        <thead className="sticky top-0 bg-gray-200 z-10">
                            {table
                                .getHeaderGroups()
                                .map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(
                                            (header) => (
                                                <th
                                                    key={header.id}
                                                    className="border p-2"
                                                >
                                                    <div className="flex flex-col gap-2">

                                                        {/* HEADER TITLE */}
                                                        <div
                                                            className="flex items-center justify-between cursor-pointer"
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            <span>
                                                                {flexRender(
                                                                    header.column
                                                                        .columnDef.header,
                                                                    header.getContext()
                                                                )}
                                                            </span>

                                                            <span>
                                                                {{
                                                                    asc: "↑",
                                                                    desc: "↓",
                                                                }[
                                                                    header.column.getIsSorted()
                                                                ] ?? ""}
                                                            </span>
                                                        </div>

                                                        {/* FILTER INPUT */}
                                                        <input
                                                            type="text"
                                                            placeholder="Filter..."
                                                            value={
                                                                header.column.getFilterValue() ??
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                header.column.setFilterValue(
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="border px-2 py-1 text-sm bg-white"
                                                        />
                                                    </div>
                                                </th>
                                            )
                                        )}
                                    </tr>
                                ))}
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50"
                                >
                                    {row
                                        .getVisibleCells()
                                        .map((cell) => (
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
        </div>
    )
}

export default App