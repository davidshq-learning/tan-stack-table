import { useGetBooks } from "@/api/useGetBooks";
import { useDebounce } from "@/hooks/useDebounce";
import { Book } from "@/types/Books";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import TanStackBasicTable from "./TanStackTable/TanStackBasicTable";

const BookTableComponent = () => {
  // sorting state of the table
  const [sorting, setSorting] = useState<SortingState>([]);

  // column filters state of the table
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const debouncedColumnFilters: ColumnFiltersState = useDebounce(
    columnFilters,
    1000
  );

  // pagination state of the table
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0, //initial page index
    pageSize: 20, //default page size
  });

  const { allBooksData, isAllBooksDataLoading } = useGetBooks({
    sorting,
    columnFilters: debouncedColumnFilters,
    pagination,
  });

  console.log('allBooksData', allBooksData)

  const bookColumns: ColumnDef<Book>[] = [
    {
      header: "ID",
      accessorKey: "id",
      enableColumnFilter: false,
    },
    {
      header: "ISBN",
      accessorKey: "isbn",
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
  ];
  return (
    <>
      <TanStackBasicTable
        isTableDataLoading={isAllBooksDataLoading}
        paginatedTableData={allBooksData}
        columns={bookColumns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </>
  );
};

export default BookTableComponent;
