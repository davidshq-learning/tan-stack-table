import useSWR from 'swr';
import { UseUsersInput, UseUsersResponse } from "../types/Users";

const backend_url = "http://localhost:3000";

const getAllUsersFn = async ({ sorting, columnFilters, pagination }: UseUsersInput): Promise<UseUsersResponse> => {
  // Define the values for pagination, filtering, and sorting
  const page = pagination.pageIndex + 1,
    per_page = pagination.pageSize;
  const filters = columnFilters.reduce((acc, { id, value }) => ({ ...acc, [id]: value }), {});
  const sorting_param = sorting.map(({ id, desc }) => `${id}:${desc ? 'desc' : 'asc'}`).join(',');

  // Create the URL with the query parameters
  const url = new URL(`${backend_url}/users`);
  const params = { ...filters, sortBy: sorting_param, page, limit: per_page };
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));

  // Attempt to fetch URL
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

export const useGetUsers = (input: UseUsersInput) => {
  const { data: allUsersData, error } = useSWR<UseUsersResponse, Error>(
    ["users", input.sorting, input.columnFilters, input.pagination],
    () => getAllUsersFn(input)
  );

  const isAllUsersDataLoading = !allUsersData && !error;

  return { allUsersData, isAllUsersDataLoading, error };
};
