"use client";

import { User } from "@prisma/client";
import { api } from "~/trpc/react";
import { Skeleton } from "~/components/ui/skeleton";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";
import { removeUnderscore } from "~/lib/utils";

function EmployeesTableSkeleton() {
  return <Skeleton className="h-12 w-12 rounded-full" />;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phoneNo",
    header: "Phone No",
  },
  {
    accessorKey: "state",
    header: "State",
  },
  {
    accessorKey: "roleName",
    header: "Role",
    cell: ({ row }) => {
      return <span>{removeUnderscore(row.getValue("roleName"))}</span>;
    },
  },
];

export function EmployeesTable() {
  const { data: users, isLoading } = api.user.getAllUsers.useQuery<User[]>(
    undefined,
    {
      refetchOnWindowFocus: false,
    },
  );

  return (
    <div className="rounded-md border-b bg-white p-6 shadow">
      {isLoading ? (
        <EmployeesTableSkeleton />
      ) : (
        <DataTable columns={columns} data={users ? users : []} />
      )}
    </div>
  );
}
