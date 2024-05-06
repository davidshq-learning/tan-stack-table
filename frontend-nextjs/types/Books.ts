import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

export interface UseBooksInput {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}

export interface UseBooksResponse {
  limit: number;
  page: number;
  total: number;
  total_filtered: number;
  data: Book[];
}

export interface Book {
  isbn: string;
  title: string;
  authors: [];
  publishers: [];
  virtual_pages: number;
  web_url: string;
  issued: string;
}
