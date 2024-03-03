"use client";
import dynamic from "next/dynamic";
import LeavesTable from "~/components/custom/LeavesTable";

const NoSSR = dynamic(() => import("~/components/custom/LeavesPageActions"), {
  ssr: false,
});
export default function LeavesPage() {
  return (
    <div className="flex flex-col gap-6">
      <NoSSR />
      <LeavesTable />
    </div>
  );
}
