"use client";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@/utils/functions/formatting";

const USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

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
      <div>{USDollar.format(row.getValue('amount'))}</div>
    )
  },
  {
    accessorKey: "points",
    header: "Points Earned",
  },
]
