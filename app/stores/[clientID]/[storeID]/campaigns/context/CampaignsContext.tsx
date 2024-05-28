"use client";
import { createContext, useContext, useState, useEffect } from "react";

import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";
import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";


type SocialMedia = 'instagram'|'facebook'|'twitter'|'story'

export type CampaignsState = {
    selectedSocial: SocialMedia
    setSelectedSocial: React.Dispatch<React.SetStateAction<SocialMedia>>
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

    
    return (
        <CampaignsContext.Provider
            value={{
                selectedSocial,
                setSelectedSocial
            }}
        >
            {children}
        </CampaignsContext.Provider>
    )
}