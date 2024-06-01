"use client";
import React from "react";
import Image from "next/image";

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
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='w-[240px] flex flex-col items-center bg-neutral-100 rounded-xl cursor-pointer hover:scale-[102%] transition-transform duration-300'>
                    <Image
                        src={rewardData.image_url || '/images/default-store-logo.jpg'}
                        alt='Reward Image'
                        width={240}
                        height={200}
                        objectFit='cover'
                        style={{ borderRadius: 12 }}
                    />

                    <div className='w-full flex flex-col items-start p-5 gap-2'>
                        <div className='w-full min-h-[56px] flex flex-row items-center justify-start gap-3.5'>
                            {renderStaticIcon({ name: rewardData.icon_name })}

                            <div className='max-w-[160px] max-h-[56px]'>
                                {rewardData.title}
                                {rewardData.conditions? '*': ''}
                            </div>
                        </div>

                        {rewardData.conditions && (
                            <p>{'*' + rewardData.conditions}</p>
                        )}

                        <Button disabled className='bg-transparent border border-neutral-300'>
                            {rewardData.cost.toLocaleString()} points
                        </Button>
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className='md:min-w-[760px]'>
                <DialogHeader>
                    <DialogTitle>
                        Edit Reward
                    </DialogTitle>
                </DialogHeader>

                <EditRewardForm rewardData={rewardData} />
            </DialogContent>
        </Dialog>
    )
}