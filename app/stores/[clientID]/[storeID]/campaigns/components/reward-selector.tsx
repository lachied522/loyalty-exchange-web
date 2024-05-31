"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib";

import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";
import { type CampaignsState, useCampaignsContext } from "../context/CampaignsContext";

export default function RewardSelector() {
    const { storeData } = useStoreIDContext() as StoreIDState;
    const { selectedTemplate, setSelectedTemplate } = useCampaignsContext() as CampaignsState;

    return (
        <div className='flex flex-row flex-wrap items-stretch md:items-center gap-2 p-6'>
            <Button
                variant='outline'
                onClick={() => setSelectedTemplate('custom')}
                className={cn(selectedTemplate === 'custom' && 'bg-neutral-100')}
            >
                Custom
            </Button>
            {storeData.rewards.map((reward) => (
            <Button
                key={`reward-option-${reward.id}`}
                variant='outline'
                onClick={() => setSelectedTemplate(reward.id)}
                className={cn(selectedTemplate === reward.id && 'bg-neutral-100')}
            >
                {reward.title}
            </Button>
            ))}
        </div>
    )
}