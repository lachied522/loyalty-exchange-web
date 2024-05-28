"use client";
import { ColumnDef } from "@tanstack/react-table";

import { formatDate } from "@/utils/functions/formatting";

export type Redemption = {
    date: string,
    name: string,
    title: string
}

export const columns: ColumnDef<Redemption>[] = [
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
    accessorKey: "title",
    header: "Reward",
  },
]
