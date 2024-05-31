"use client";
import { ColumnDef } from "@tanstack/react-table";

import RewardDialog from "./reward-dialog";
import DeleteRewardDialog from "./delete-reward-dialog";

import type { Reward } from "@/types/helpers";

export const columns: ColumnDef<Reward>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "cost",
    header: "Cost ($)",
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <div className='text-end'>Actions</div>
    ),
    cell: ({ row }) => (
      <div className='flex flex-row justify-end gap-6'>
        <RewardDialog rewardData={row.original} />
        <DeleteRewardDialog rewardID={row.original.id} />
      </div>
    )
  },
]
