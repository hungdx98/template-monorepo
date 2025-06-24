'use client'

import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shadcn/ui/table'
import cx from '@/utils/styled'
import { useState } from 'react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  defaultSorting?: SortingState
  headerClassName?: string
  cellClassName?: string
  className?: string
  onRowClick?: (row: TData) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  defaultSorting = [],
  headerClassName,
  cellClassName,
  className,
  onRowClick
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    },
    enableMultiSort: false
  })

  const handleRowClick = (row: TData) => () => {
    if (typeof onRowClick === 'function') {
      onRowClick(row)
    }
  }

  const renderTbody = (cell: Cell<TData, unknown>, index: number) => {
    const isFirst = index === 0
    const isLast = index === columns.length - 1

    return (
      <TableCell
        className={cx(
          {
            'text-left custom-text-medium-strong pl-space-500': isFirst,
            'custom-text-small': !isFirst,
            'px-space-500': isLast
          },
          cellClassName
        )}
        key={cell.id}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    )
  }

  return (
    <div className={cx("rounded-md border", className)}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const isFirst = index === 0

                return (
                  <TableHead
                    className={cx(
                      {
                        'w-space-2500': !isFirst
                      },
                      headerClassName
                    )}
                    key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cx({
                  'cursor-pointer hover:opacity-80':
                    typeof onRowClick === 'function'
                })}
                onClick={handleRowClick(row.original)}>
                {row.getVisibleCells().map(renderTbody)}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
