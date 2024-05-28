"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib";

import { type CampaignsState, useCampaignsContext } from "../context/CampaignsContext";


export default function SocialMediaSelector() {
    const { selectedSocial, setSelectedSocial } = useCampaignsContext() as CampaignsState;

    return (
        <div className='flex flex-col md:flex-row items-stretch md:items-center gap-2 p-6'>
            <div className='mr-3'>
                Select a template:               
            </div>
            <Button
                variant={selectedSocial ==='instagram'? 'default': 'secondary'}
                onClick={() => setSelectedSocial('instagram')}
            >
                Instagram
            </Button>
            <Button
                variant={selectedSocial ==='facebook'? 'default': 'secondary'}
                onClick={() => setSelectedSocial('facebook')}
            >
                Facebook
            </Button>
            <Button
                variant={selectedSocial ==='twitter'? 'default': 'secondary'}
                onClick={() => setSelectedSocial('twitter')}
            >
                Twitter
            </Button>
            <Button
                variant={selectedSocial ==='story'? 'default': 'secondary'}
                onClick={() => setSelectedSocial('story')}
            >
                Story
            </Button>
        </div>
    )
}