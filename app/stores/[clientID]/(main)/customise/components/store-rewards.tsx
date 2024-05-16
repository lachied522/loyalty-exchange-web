"use client";
import { useMemo } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { type CustomiseState, useCustomiseContext } from "../context/CustomiseContext";

import { columns } from "./rewards/columns";
import RewardsTable from "./rewards/table";


export default function StoreRewards() {
    const { selectedStoreData } = useCustomiseContext() as CustomiseState;

    const formattedData = useMemo(() => {
        return selectedStoreData.reward_types;
    }, [selectedStoreData]);

    return (
        <Card>
            <CardContent className='flex flex-col items-stretch gap-4 p-6'>
                <div className='w-full flex flex-row items-center'>
                    <div className='text-xl font-semibold'>Your Rewards</div>
                </div>
                <p></p>
                <RewardsTable columns={columns} data={formattedData} />
            </CardContent>
        </Card>
    )
}