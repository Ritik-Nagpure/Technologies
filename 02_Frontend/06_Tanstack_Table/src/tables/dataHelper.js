import { createColumnHelper } from "@tanstack/react-table"
import { students, subjects } from "../assets/students"

const columnHelper = createColumnHelper()

const numberFilter = (row, columnId, filterValue) => {
  return row.getValue(columnId) === Number(filterValue)
}

export const columns = [
  columnHelper.accessor("student_id", {
    header: "ID",
    enableSorting: true,
    filterFn: "includesString",  // contains matching,
  }),

  columnHelper.accessor("student_name", {
    header: "Student Name",
    enableSorting: true,
  }),

  columnHelper.accessor("age", {
    header: "Age",
    enableSorting: true,
    filterFn: numberFilter, // exact matching
  }),

  columnHelper.accessor("gender", {
    header: "Gender",
    enableSorting: true,
  }),

  columnHelper.accessor("class", {
    header: "Class",
    enableSorting: true,
    filterFn: "equalsString", // exact matching

  }),

  columnHelper.accessor("address", {
    header: "Address",
    enableSorting: true,
  }),

  columnHelper.accessor("section", {
    header: "Section",
    enableSorting: true,
  }),

  // Dynamic Subjects
  columnHelper.accessor(subjects["1101"], {
    header: subjects["1101"],
    enableSorting: true,
    filterFn: "equalsString",
  }),

  columnHelper.accessor(subjects["1102"], {
    header: subjects["1102"],
    enableSorting: true,
    filterFn: "equalsString",
  }),

  columnHelper.accessor(subjects["1103"], {
    header: subjects["1103"],
    enableSorting: true,
    filterFn: "equalsString",
  }),

  columnHelper.accessor(subjects["1104"], {
    header: subjects["1104"],
    enableSorting: true,
    filterFn: "equalsString",
  }),

  columnHelper.accessor(subjects["1105"], {
    header: subjects["1105"],
    enableSorting: true,
    filterFn: "equalsString",
  }),

  columnHelper.accessor(subjects["1106"], {
    header: subjects["1106"],
    enableSorting: true,
    filterFn: "equalsString",
  }),

  columnHelper.accessor("total", {
    header: "Total %",
    filterFn: "equalsString",
    enableSorting: true,
  }),
]


export const studentlist = students.slice(0, 100);