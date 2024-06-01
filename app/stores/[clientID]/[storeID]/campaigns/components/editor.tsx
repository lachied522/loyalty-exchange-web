"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { type CampaignsState, useCampaignsContext } from "../context/CampaignsContext";
import SocialMediaSelector from "./social-media-selector";
import RewardSelector from "./reward-selector";
import { ArrowDownToLine } from "lucide-react";


export default function Editor() {
    const { title, body, setTitle, setBody, downloadImage } = useCampaignsContext() as CampaignsState;

    return (
        <div className='flex flex-col gap-2'>
            <div className='font-medium'>
                Social Media
            </div>
            <SocialMediaSelector />

            <div className='font-medium'>
                Template
                <br />
                <span className='text-sm font-normal'>You can select one of your rewards, or go custom.</span>
            </div>
            <RewardSelector />

            <div className='font-medium'>
                Title Text
            </div>
            <div className='p-6'>
                <Input
                    type="text"
                    placeholder='Rewards'
                    maxLength={24}
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    className='max-w-[360px]'
                />
            </div>

            <div className='font-medium'>
                Main Text
            </div>
            <div className='p-6'>
                <Input
                    type="text"
                    placeholder='Our rewards are here! Download now.'
                    maxLength={64}
                    value={body}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBody(e.target.value)}
                    className='max-w-[360px]'
                />
            </div>
            
            <div className='flex justify-start'>
                <Button onClick={downloadImage}>
                    <ArrowDownToLine size={16} className='mr-2' />
                    Download
                </Button>
            </div>
        </div>
    )
}