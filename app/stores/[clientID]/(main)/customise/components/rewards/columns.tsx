"use client";
import { ColumnDef } from "@tanstack/react-table";

import RewardDialog from "./reward-dialog";

import type { Reward } from "@/types/helpers";

export const columns: ColumnDef<Reward>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "cost",
    header: "Points",
  },
  {
    header: "Edit",
    cell: ({ row }) => (
      <RewardDialog rewardData={row.original} />
    )
  },
]
