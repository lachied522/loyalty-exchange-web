"use client";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib";

import { type CampaignsState, useCampaignsContext } from "../context/CampaignsContext";

export default function SocialMediaSelector() {
    const { selectedSocial, setSelectedSocial } = useCampaignsContext() as CampaignsState;

    return (
        <div className='flex flex-row flex-wrap items-stretch md:items-center gap-2 p-6'>
            <Button
                variant='outline'
                onClick={() => setSelectedSocial('instagram')}
                className={cn(
                    'flex flex-row gap-3.5',
                    selectedSocial === 'instagram' && 'bg-neutral-100'
                )}
            >
                <Image
                    src='/campaigns/instagram-logo-black.jpg'
                    alt=''
                    width={24}
                    height={24}
                />
                Instagram
            </Button>

            <Button
                variant='outline'
                onClick={() => setSelectedSocial('facebook')}
                className={cn(
                    'flex flex-row gap-3.5',
                    selectedSocial === 'facebook' && 'bg-neutral-100'
                )}
            >
                <Image
                    src='/campaigns/facebook-logo-primary.png'
                    alt=''
                    width={24}
                    height={24}
                />
                Facebook
            </Button>

            <Button
                variant='outline'
                onClick={() => setSelectedSocial('twitter')}
                className={cn(
                    'flex flex-row gap-3.5',
                    selectedSocial === 'twitter' && 'bg-neutral-100'
                )}
            >
                <Image
                    src='/campaigns/twitter-logo.png'
                    alt=''
                    width={20}
                    height={20}
                />
                Twitter
            </Button>

            <Button
                variant='outline'
                onClick={() => setSelectedSocial('story')}
                className={cn(
                    'flex flex-row gap-3.5',
                    selectedSocial === 'story' && 'bg-neutral-100'
                )}
            >
                <Image
                    src='/campaigns/instagram-logo-black.jpg'
                    alt=''
                    width={24}
                    height={24}
                />
                Story
            </Button>
        </div>
    )
}