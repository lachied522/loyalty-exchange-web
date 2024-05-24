"use client";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate, formatAmount } from "@/utils/functions/formatting";

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
    cell: ({ row }) => (
      <div className='text-green-400'>{formatAmount(row.getValue('amount'))}</div>
    )
  },
  {
    accessorKey: "points",
    header: "Points Earned",
  },
]
