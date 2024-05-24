"use client";
import { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { type CustomiseState, useCustomiseContext } from "../context/CustomiseContext";

import RewardDialog from "./rewards/reward-dialog";
import RewardsTable from "./rewards/table";
import { columns } from "./rewards/columns";

export default function StoreRewards() {
    const { selectedStoreData } = useCustomiseContext() as CustomiseState;

    const formattedData = useMemo(() => {
        return selectedStoreData.rewards;
    }, [selectedStoreData]);

    return (
        <Card>
            <CardContent className='flex flex-col items-stretch gap-4 p-6'>
                <div className='w-full flex flex-row items-center justify-between'>
                    <div className='text-xl font-semibold'>Your Rewards</div>

                    <div className='flex flew-row justify-end'>
                        <RewardDialog isNewReward />
                    </div>
                </div>
                
                <RewardsTable columns={columns} data={formattedData} />
            </CardContent>
        </Card>
    )
}