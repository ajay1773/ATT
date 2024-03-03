"use client";

import { ApproverOnLeaves, Leave, LeaveStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import classNames from "classnames";
import moment from "moment";
import { DataTable } from "~/components/ui/data-table";
import { Skeleton } from "~/components/ui/skeleton";
import { removeUnderscore } from "~/lib/utils";
import {
  TLeaveWithApprovers as LeaveWithApprovers,
  TLeaveApproversWithUsers,
} from "~/server/api/modules/leaves/schema";
import { api } from "~/trpc/react";

type LeavesTableProps = {};

enum StatusCellColors {
  APPROVED = "bg-green-400 border-green-500",
  PENDING = "bg-yellow-400 border-yellow-500",
  REJECTED = "bg-red-400 border-red-500",
  CONSUMED = "bg-orange-400 border-orange-500",
}

function LeavesTableSkeleton() {
  return <Skeleton className="h-12 w-12 rounded-full" />;
}

const columns: ColumnDef<LeaveWithApprovers>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <span>{removeUnderscore(row.getValue("type"))}</span>,
  },
  {
    accessorKey: "description",
    header: "Remarks",
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => (
      <span>{moment(row.getValue("from")).format("LLL")}</span>
    ),
  },
  {
    accessorKey: "to",
    header: "To",
    cell: ({ row }) => <span>{moment(row.getValue("to")).format("LLL")}</span>,
  },
  {
    accessorKey: "approverOnLeaves",
    header: "Approvers",
    cell: ({ row }) => {
      const value: TLeaveApproversWithUsers[] =
        row.getValue("approverOnLeaves");
      let label = "";
      if (value.length === 1) {
        label = `${value[0]?.user.firstName} ${value[0]?.user.lastName}`;
      } else {
        label = `${value[0]?.user.firstName} ${value[0]?.user.lastName} + ${value.length - 1}`;
      }
      return <span>{label}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value: LeaveStatus = row.getValue("status");
      const className = classNames(
        "px-4 py-2 text-white font-semibold rounded-full text-xs border",
        {
          [StatusCellColors.APPROVED]: value === "APPROVED",
          [StatusCellColors.PENDING]: value === "PENDING",
          [StatusCellColors.REJECTED]: value === "REJECTED",
          [StatusCellColors.CONSUMED]: value === "CONSUMED",
        },
      );

      return <span className={className}>{value}</span>;
    },
  },
];

export default function LeavesTable({}: LeavesTableProps) {
  const { data: leaves, isLoading } = api.leaves.getLeavesForUser.useQuery<
    LeaveWithApprovers[]
  >(undefined, {
    refetchOnWindowFocus: false,
  });
  return (
    <div className=" rounded-md border-b bg-white p-6 shadow">
      {isLoading ? (
        <LeavesTableSkeleton />
      ) : (
        <DataTable columns={columns} data={leaves ? leaves : []} />
      )}
    </div>
  );
}
