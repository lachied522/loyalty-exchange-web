"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";

import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";

import type { Tables } from "@/types/supabase";

type SocialMedia = 'instagram'|'facebook'|'twitter'|'story'

export type CampaignsState = {
    canvasRef: React.RefObject<HTMLCanvasElement>
    selectedSocial: SocialMedia
    selectedTemplate: string
    title: string
    body: string
    isLoading: boolean
    setSelectedSocial: React.Dispatch<React.SetStateAction<SocialMedia>>
    setSelectedTemplate: React.Dispatch<React.SetStateAction<string>>
    setTitle: React.Dispatch<React.SetStateAction<string>>
    setBody: React.Dispatch<React.SetStateAction<string>>
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
    downloadImage: () => void
}

const CampaignsContext = createContext<any>(null);

export const useCampaignsContext = () => {
    return useContext(CampaignsContext);
};

interface CampaignsContextProviderProps {
    children: React.ReactNode
}

export default function CampaignsContextProvider({ children }: CampaignsContextProviderProps) {
    const { storeData } = useStoreIDContext() as StoreIDState;
    const [selectedSocial, setSelectedSocial] = useState<SocialMedia>('instagram');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('custom');
    const [title, setTitle] = useState<string>('Rewards');
    const [body, setBody] = useState<string>('Our rewards are here! Download now.');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const canvasRef = useRef<HTMLCanvasElement>(null); // canvas to display on screen
  
    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (canvas){
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'my-campaign.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    useEffect(() => {
        // update text when selected reward changes
        let _text = 'Our rewards are here! Download now.';
        if (selectedTemplate !== 'custom') {
            const reward = storeData.rewards.find((obj) => obj.id === selectedTemplate);
            if (reward) {
                _text = `Spend $${reward.cost} get ${reward.title}!`;
            }
        }
        setBody(_text);
    }, [storeData.rewards, selectedTemplate, setBody]);

    return (
        <CampaignsContext.Provider
            value={{
                canvasRef,
                selectedSocial,
                selectedTemplate,
                title,
                body,
                isLoading,
                setSelectedSocial,
                setSelectedTemplate,
                setTitle,
                setBody,
                setIsLoading,
                downloadImage
            }}
        >
            {children}
        </CampaignsContext.Provider>
    )
}