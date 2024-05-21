"use client";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@/utils/functions/formatting";

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
    header: "Total Dollars Spent",
    cell: ({ row }) => (
      <div>{USDollar.format(row.getValue('dollarsSpent'))}</div>
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
