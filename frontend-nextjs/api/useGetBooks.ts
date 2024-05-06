import useSWR from 'swr';
import {UseBooksInput, UseBooksResponse} from "@/types/Books";

const search_url = process.env.NEXT_PUBLIC_OSS_HOST;
const username = process.env.NEXT_PUBLIC_OSS_USERNAME;
const password = process.env.NEXT_PUBLIC_OSS_PASSWORD;
console.log('username', username)

const getAllBooksFn = async ({ sorting, columnFilters, pagination }: UseBooksInput): Promise<UseBooksResponse> => {
    // Define the values for pagination, filtering, and sorting
    const page = pagination.pageIndex + 1,
        per_page = pagination.pageSize;

    const filters = columnFilters.reduce((acc, { id, value }) => ({ ...acc, [id]: value }), {});
    const sorting_param = sorting.map(({ id, desc }) => `${id}:${desc ? 'desc' : 'asc'}`).join(',');

    // Create the URL with the query parameters
    const url = new URL(`${search_url}`);

    // Encode the username and password
    const auth = `${username}:${password}`
    const encodedAuth = window.btoa(auth)

    // Add authorization header to call
    const headers = new Headers({
        'Authorization': `Basic ${encodedAuth}`,
    })

    const params = { ...filters, sort: sorting_param, from: page, size: per_page };
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, String(value)));

    // Attempt to fetch URL
    let res;
    try {
        res = await fetch(url.toString(), {headers});
    } catch (err) {
        throw new Error("Network error");
    }

    if (!res.ok) {
        throw new Error(res.statusText);
    }

    const response = await res.json()
    
    console.log('response', response)

    const books = response.hits.hits.map(hit => hit._source);

    console.log('books', books)
    return books;
};

export const useGetBooks = (input: UseBooksInput) => {
    const { data: allBooksData, error } = useSWR<UseBooksResponse, Error>(
        ["books", input.sorting, input.columnFilters, input.pagination],
        () => getAllBooksFn(input)
    );

    const isAllBooksDataLoading = !allBooksData && !error;

    return {allBooksData, isAllBooksDataLoading, error};
};
