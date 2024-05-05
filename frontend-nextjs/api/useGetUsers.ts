import useSWR from 'swr';
import { UseUsersInput, UseUsersResponse } from "../types/Users";

const backend_url = "http://localhost:3000";

const getAllUsersFn: {
  ({
    sorting,
    columnFilters,
    pagination,
  }: UseUsersInput): Promise<UseUsersResponse>;
} = async ({ sorting, columnFilters, pagination }: UseUsersInput) => {
  // set pagination
  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;
  // set filtering
  const filters = columnFilters.reduce((acc, { id, value }) => ({ ...acc, [id]: value }), {});
  // set sorting
  const sorting_param = sorting.map(({ id, desc }) => `${id}:${desc ? 'desc' : 'asc'}`).join(',');

  const url = new URL(`${backend_url}/users`);
  const params = { ...filters, sortBy: sorting_param, page, limit: per_page };
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));

  let res;
  try {
    res = await fetch(url.toString());
  } catch (err) {
    throw new Error("Network error");
  }

  if (!res.ok) {
    throw new Error(res.statusText);
  }

  return await res.json();
};

export const useGetUsers = ({
  sorting,
  columnFilters,
  pagination,
}: UseUsersInput) => {
  const { data: allUsersData, error } = useSWR<UseUsersResponse, Error>(
    ["users", sorting, columnFilters, pagination],
    () => getAllUsersFn({ sorting, columnFilters, pagination })
  );

  const isAllUsersDataLoading = !allUsersData && !error;

  return { allUsersData, isAllUsersDataLoading, error };
};
