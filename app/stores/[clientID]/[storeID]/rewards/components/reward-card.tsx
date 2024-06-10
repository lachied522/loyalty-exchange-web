"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

import { intervalToDuration, formatDuration } from 'date-fns';

import { Clock } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { renderStaticIcon } from "@/components/icons/helpers";

import EditRewardForm from "./edit-reward-form";

import type { Reward } from "@/types/helpers";

interface RewardCardProps {
    rewardData: Reward
}

export default function RewardCard({ rewardData }: RewardCardProps) {
    const [timeRemaining, setTimeRemaining] = useState<string | null>(!rewardData.is_archived && rewardData.expires_at? '...': null);

    useEffect(() => {
        let countdownID: ReturnType<typeof setInterval> | null = null;

        if (!rewardData.is_archived && rewardData.expires_at) {
            countdownID = setInterval(() => {
                const now = new Date();
                const intervalDuration = intervalToDuration({ start: now, end: rewardData.expires_at! });
                const formattedDuration = formatDuration({ days: intervalDuration.days, hours: intervalDuration.hours }, { delimiter: ', ' });
                setTimeRemaining(formattedDuration);
              }, 1000);
        }
        
        return () => {
            if (countdownID) clearTimeout(countdownID);
        }
    }, []);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='flex flex-col items-center gap-3.5 cursor-pointer group'>
                    {timeRemaining && (
                    <div className='flex flex-row gap-2'>
                        <Clock />
                        {timeRemaining}
                    </div>
                    )}
                    <div className='min-h-[300px] w-[240px] flex flex-col items-center bg-neutral-100 rounded-xl cursor-pointer group-hover:scale-[102%] transition-transform duration-300'>
                        <div className='w-[240px] h-[160px] relative'>
                            <Image
                                src={rewardData.image_url || '/images/default-store-logo.jpg'}
                                alt='Reward Image'
                                fill
                                style={{ objectFit:'cover', borderRadius: 12 }}
                            />
                        </div>

                        <div className='w-full flex flex-col items-start p-5 gap-2'>
                            <div className='w-full min-h-[56px] flex flex-row items-center justify-start gap-3.5'>
                                {renderStaticIcon({ name: rewardData.icon_name })}

                                <div className='max-w-[160px] max-h-[56px]'>
                                    {rewardData.title}
                                    {rewardData.conditions? '*': ''}
                                    {rewardData.conditions && (
                                    <span className='text-sm'>
                                        <br/>{'*' + rewardData.conditions}
                                    </span>
                                    )}
                                </div>
                            </div>

                            <Button disabled className='bg-transparent border border-neutral-300'>
                                {rewardData.cost.toLocaleString()} points
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className='md:min-w-[760px]'>
                <DialogHeader>
                    <DialogTitle>
                        {rewardData.is_archived? 'Archived Reward': 'Edit Reward'}
                    </DialogTitle>
                </DialogHeader>

                <EditRewardForm rewardData={rewardData} />
            </DialogContent>
        </Dialog>
    )
}