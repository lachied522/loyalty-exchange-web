"use client";
import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

import RewardDialog from "./rewards/reward-dialog";
import RewardsTable from "./rewards/table";
import { columns } from "./rewards/columns";

export default function StoreRewards() {
    const { storeData } = useStoreIDContext() as StoreIDState;

    return (
        <div className='flex flex-col items-stretch gap-4 p-6'>
            <div className='w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2'>
                <div className='text-xl font-semibold'>Your Rewards</div>

                <div className='flex flew-row justify-end'>
                    <RewardDialog isNewReward />
                </div>
            </div>
            
            <RewardsTable columns={columns} data={storeData.rewards} />
        </div>
    )
}