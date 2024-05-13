"use client";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@/utils/functions/formatting";

export type Transaction = {
    date: string,
    name: string,
    amount: number,
    points: number,
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div>{formatDate(row.getValue('date'))}</div>
    )
  },
  {
    accessorKey: "name",
    header: "First Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "points",
    header: "Points Earned",
  },
]
