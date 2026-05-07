import { flexRender, getCoreRowModel, useReactTable, } from "@tanstack/react-table"
import { columns, studentlist } from "./dataHelper"

const simpleTable = () => {
  const table = useReactTable({
    data: studentlist,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="h-full overflow-auto border">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-gray-200 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-amber-500">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border p-2"
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

        <tbody className="">
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

export default simpleTable