"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";

export type StoreIDState = {
    storeID: string
    storeData: ClientIDState['clientData']['stores'][number]
    customersData: ClientIDState['customerDataMap'][string] | null
    isMobile: boolean
    isSidebarOpenOnMobile: boolean
    setIsMobile: React.Dispatch<React.SetStateAction<boolean>>
    setIsSidebarOpenOnMobile: React.Dispatch<React.SetStateAction<boolean>>
}

const StoreIDContext = createContext<any>(null);

export const useStoreIDContext = () => {
    return useContext(StoreIDContext);
};

interface StoreIDContextProviderProps {
    children: React.ReactNode
    storeID: string
}

export default function StoreIDContextProvider({
    children,
    storeID
}: StoreIDContextProviderProps) {
    const { clientData } = useClientIDContext() as ClientIDState;
    const [activeStoreID, setActiveStoreID] = useState<string>(storeID); // ID of store that is currently active
    const [isSidebarOpenOnMobile, setIsSidebarOpenOnMobile] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // add event listener for obtaining screen width
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            setIsSidebarOpenOnMobile(false);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, []);

    const storeData = useMemo(() => {
        return clientData.stores.find((store) => store.id === activeStoreID);
    }, [activeStoreID, clientData.stores]);
    
    useEffect(() => {
        // set active store id in parent
        setActiveStoreID(storeID);
    }, [storeID, setActiveStoreID]);
    
    return (
        <StoreIDContext.Provider
            value={{
                storeData,
                storeID,
                isMobile,
                isSidebarOpenOnMobile,
                setIsMobile,
                setIsSidebarOpenOnMobile,
            }}
        >
            {children}
        </StoreIDContext.Provider>
    )
}