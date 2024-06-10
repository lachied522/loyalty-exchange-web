"use client";
import { useMemo } from "react";

import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

import RewardCard from "./reward-card";
import CreateNewReward from "./create-new-reward";

export default function RewardsList() {
    const { storeData } = useStoreIDContext() as StoreIDState;

    const rewards = useMemo(() => {
        // split reward into ongoing, limited, and archived
        const now = new Date();
        return {
            ongoing: storeData.rewards.filter((reward) => !reward.is_archived && !reward.expires_at),
            limited: storeData.rewards.filter((reward) => !reward.is_archived && !!reward.expires_at && new Date(reward.expires_at).getTime() > now.getTime()),
            archived: storeData.rewards.filter((reward) => reward.is_archived),
        }
    }, [storeData.rewards]);

    return (
        <div className='px-6'>
            <div className='text-lg font-semibold'>Ongoing</div>
            <div className='flex flex-wrap items-stretch justify-center md:justify-start p-6 xl:p-12 gap-6 md:gap-24'>
                {rewards.ongoing.map((reward) => (
                    <RewardCard
                        key={`reward-card-${reward.id}`}
                        rewardData={reward}
                    />
                ))}

                <CreateNewReward />
            </div>
            
            <div className='text-lg font-semibold'>Limited Time</div>
            <div className='flex flex-wrap items-stretch justify-center md:justify-start p-6 xl:p-12 gap-6 md:gap-24'>
                {rewards.limited.map((reward) => (
                    <RewardCard
                        key={`reward-card-${reward.id}`}
                        rewardData={reward}
                    />
                ))}

                <CreateNewReward isLimitedTime />
            </div>
            
            {rewards.archived.length > 0 && (
            <>
                <div className='text-lg font-semibold'>Archived</div>
                <div className='flex flex-wrap items-stretch justify-center md:justify-start p-6 xl:p-12 gap-6 md:gap-24'>
                    {rewards.archived.map((reward) => (
                        <RewardCard
                            key={`reward-card-${reward.id}`}
                            rewardData={reward}
                        />
                    ))}
                </div>
            </>
            )}
        </div>
    )
}