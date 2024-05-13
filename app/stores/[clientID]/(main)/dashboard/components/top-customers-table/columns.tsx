"use client";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@/utils/functions/formatting";

export type Customer = {
    name: string,
    points: number,
    dollarsSpent: number
}

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "First Name",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "dollarsSpent",
    header: "Dollars Spent",
  },
  {
    accessorKey: "lastPurchase",
    header: "Last Purchase",
    cell: ({ row }) => (
      <div>{formatDate(row.getValue('lastPurchase'))}</div>
    )
  },
]
