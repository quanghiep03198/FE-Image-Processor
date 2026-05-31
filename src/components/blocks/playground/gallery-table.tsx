import { useGetImagesQueryKey } from '@/apis/images/hooks'
import type { IImage } from '@/apis/images/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useScrollToFn from '@/hooks/use-scroll-fn'
import useVirtualScrollPadding from '@/hooks/use-virtual-scroll-padding'
import generateAvatar from '@/lib/avatar'
import { dateRangeFilter } from '@/lib/date-range-filter'
import env, { cn } from '@/lib/utils'
import { useSearch } from '@tanstack/react-router'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { filesize } from 'filesize'
import { ImagesIcon } from 'lucide-react'
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import type { DateRange } from 'react-day-picker'
import ImageActionsDropdown from './image-actions-dropdown'
import ImageDialog from './image-dialog'

/**
 * Build column filters for gallery table based on search params.
 * Only includes filters when values are provided.
 */
const buildColumnFilters = (
  mimeType: string | undefined,
  fromDate: string | undefined,
  toDate: string | undefined,
): ColumnFiltersState => {
  const filters: ColumnFiltersState = []

  // Add mime_type filter only if provided
  if (mimeType) {
    filters.push({ id: 'mime_type', value: mimeType })
  }

  // Add date range filter only if start date is provided
  if (fromDate) {
    const startDate = new Date(fromDate)
    startDate.setHours(0, 0, 0, 0)

    const endDate = new Date(toDate ?? fromDate)
    endDate.setHours(23, 59, 59, 999)

    filters.push({
      id: 'created_at',
      value: { from: startDate, to: endDate } as DateRange,
    })
  }

  return filters
}

const GalleryTable: React.FC = () => {
  const { data, isFetching } = useGetImagesQueryKey()
  const search = useSearch({
    from: '/_playground-layout/my-images',
    select: (state) => ({ mime_type: state.mime_type, from: state.from, to: state.to }),
  })

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // Memoize filter computation to prevent unnecessary recalculations
  const nextColumnFilters = useMemo(
    () => buildColumnFilters(search.mime_type, search.from, search.to),
    [search.mime_type, search.from, search.to],
  )

  // Only update state if filters actually changed (prevent unnecessary re-renders)
  const updateFilters = useCallback(() => {
    setColumnFilters((prev) => {
      const filtersChanged =
        prev.length !== nextColumnFilters.length || JSON.stringify(prev) !== JSON.stringify(nextColumnFilters)
      return filtersChanged ? nextColumnFilters : prev
    })
  }, [nextColumnFilters])

  // Update filters when search params change
  React.useEffect(() => {
    updateFilters()
  }, [updateFilters])

  const columnHelper = createColumnHelper<IImage>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        enableColumnFilter: true,
        enableSorting: true,
        enableGlobalFilter: true,
        enableResizing: true,
        size: 300,
        sortingFn: 'alphanumericCaseSensitive',
        cell: (info) => (
          <Item size="xs" className="p-0">
            <ItemMedia variant={'icon'}>
              <img
                src={env('VITE_IMAGE_URL') + '/' + info.row.original.url}
                className="size-14 rounded-lg object-cover object-center"
                loading="lazy"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="hover:underline">
                <ImageDialog {...info.row.original} />
              </ItemTitle>
            </ItemContent>
          </Item>
        ),
      }),
      columnHelper.accessor('mime_type', {
        header: 'Type',
        enableColumnFilter: true,
        enableSorting: true,
        filterFn: 'equalsString',
      }),
      columnHelper.accessor('size', {
        header: 'Size',
        enableSorting: true,
        cell: (info: any) => filesize(info.getValue()),
      }),
      columnHelper.accessor('owner', {
        header: 'Owner',
        enableColumnFilter: true,
        enableSorting: true,
        enableGlobalFilter: true,
        size: 200,
        sortingFn: 'alphanumericCaseSensitive',
        cell: ({ getValue }) => {
          const owner = getValue()
          return (
            <Item size="xs" className="p-0">
              <ItemMedia>
                <Avatar>
                  <AvatarImage src={generateAvatar({ name: owner.display_name })} />
                  <AvatarFallback>{owner.display_name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{owner.display_name} (You)</ItemTitle>
                <ItemDescription>{owner.email}</ItemDescription>
              </ItemContent>
            </Item>
          )
        },
      }),

      columnHelper.accessor('created_at', {
        header: 'Created At',
        enableColumnFilter: true,
        enableSorting: true,
        sortingFn: 'datetime',
        filterFn: 'inDateRange',
        cell: (info: any) =>
          new Date(info.getValue()).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ImageActionsDropdown,
        enableColumnFilter: false,
        enableSorting: false,
        enableGlobalFilter: false,
        enableResizing: false,
        size: 100,
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: data ?? [],
    columns: columns,
    enableColumnFilters: true,
    enableSorting: true,
    enableGlobalFilter: true,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      inDateRange: dateRangeFilter,
    },
  })

  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToFn = useScrollToFn<HTMLDivElement>(containerRef?.current as unknown as React.RefObject<HTMLDivElement>)

  const { rows } = table.getFilteredRowModel()

  const virtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows?.length ?? 0,
    getScrollElement: () => containerRef?.current,
    estimateSize: () => 72,
    scrollToFn,
    // getItemKey: (index) => table.getRowModel().rows[index]?.id ?? index,
    enabled: typeof window !== 'undefined',
    overscan: 5,
  })

  const virtualItems = virtualizer.getVirtualItems()

  const { before, after } = useVirtualScrollPadding(virtualizer)

  const columnSizeVars = useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.getState().columnSizingInfo, table.getState().columnSizing])

  return (
    <div
      className="@container-[size]/table relative h-[calc(100cqh-152px)] flex-1 overflow-auto [--table-header-height:48px] [--table-row-height:60px]"
      style={{ ...columnSizeVars }}
      ref={containerRef}
    >
      <Table className="w-full table-auto">
        <TableHeader className="sticky! top-0 z-20 [&_th]:sticky [&_th]:top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="sticky top-0">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="group"
                  style={{ width: `calc(var(--header-${header?.id}-size)*1px)` }}
                >
                  <div className="line-clamp-1">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                  <Separator
                    orientation="vertical"
                    onDoubleClick={() => header.column.resetSize()}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    onTouchMove={header.getResizeHandler()}
                    className={cn(
                      'absolute right-0 z-0 min-w-1 cursor-col-resize! touch-none bg-border opacity-0 transition-opacity duration-500 select-none group-hover:opacity-100',
                      'top-1/2 h-2/3 -translate-y-1/2 rounded-md',
                      header.column.getCanResize() && 'hover:bg-primary',
                      header.column.getIsResizing() && 'bg-primary opacity-10',
                    )}
                  />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody style={{ height: virtualizer.getTotalSize() }}>
          {isFetching ? (
            Array.from({ length: 5 }, (_, i) => (
              <TableRow key={i}>
                {Array.from({ length: table.getAllColumns().length }, (_, j) => (
                  <TableCell key={j} style={{ height: 60 }}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : virtualItems.length === 0 ? (
            <TableRow>
              <TableCell
                align="center"
                colSpan={table.getAllColumns().length}
                className="sticky left-0 z-10 h-[calc(100cqh-var(--table-header-height))] max-w-[100cqw]"
              >
                <div color="muted" className="flex max-w-full items-center justify-center gap-x-2">
                  <ImagesIcon />
                  No images found
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <Fragment>
              {before > 0 && (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} style={{ height: before }} />
                </TableRow>
              )}
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                  <TableRow key={virtualRow.key}>
                    {row?.getVisibleCells()?.map((cell) => (
                      <TableCell
                        align="left"
                        key={cell.id}
                        style={{ height: virtualRow.size, width: `calc(var(--column-${cell.column.id}-size)*1px)` }}
                      >
                        <div className="line-clamp-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
              {after > 0 && (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} style={{ height: after }} />
                </TableRow>
              )}
            </Fragment>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default GalleryTable
