"use client";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate, formatCurrency } from "@/utils/functions/formatting";

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
    header: "Current Points Balance",
    cell: ({ row }) => (
      <div>{row.getValue('points')?.toLocaleString() || ''}</div>
    )
  },
  {
    accessorKey: "dollarsSpent",
    header: "Total Dollars Spent",
    cell: ({ row }) => (
      <div className='text-green-400'>{formatCurrency(row.getValue('dollarsSpent'))}</div>
    )
  },
  {
    accessorKey: "lastPurchase",
    header: "Last Purchase",
    cell: ({ row }) => (
      <div>{formatDate(row.getValue('lastPurchase'))}</div>
    )
  },
]
