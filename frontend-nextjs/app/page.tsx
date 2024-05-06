"use client";
import UserTableComponent from "@/components/UserTableComponent";
import { SWRConfig } from "swr";

export default function Home() {
  return (
    <SWRConfig value={{ revalidateOnFocus: false }}>
      <UserTableComponent />
    </SWRConfig>
  );
}
