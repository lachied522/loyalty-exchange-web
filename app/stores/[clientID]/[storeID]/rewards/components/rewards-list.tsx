"use client";
import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

import RewardCard from "./reward-card";
import CreateNewReward from "./create-new-reward";

export default function RewardsList() {
    const { storeData } = useStoreIDContext() as StoreIDState;
    return (
        <div className='flex flex-wrap items-center justify-center md:justify-start p-6 xl:p-12 gap-6 md:gap-24'>
            {storeData.rewards.map((reward) => (
                <RewardCard
                    key={`reward-card-${reward.id}`}
                    rewardData={reward}
                />
            ))}

            <CreateNewReward />
        </div>
    )
}