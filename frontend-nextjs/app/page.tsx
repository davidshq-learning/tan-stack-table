"use client";
import BookTableComponent from "@/components/BookTableComponent";
import { SWRConfig } from "swr";

export default function Home() {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <BookTableComponent />
    </SWRConfig>
  );
}
