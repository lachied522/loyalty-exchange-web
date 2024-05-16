"use client";
import { createContext, useContext, useState, useEffect, useMemo } from "react";

import { type ClientState, useClientContext } from "../../../context/ClientContext";

export type CustomiseState = {
    selectedStoreID: string
    selectedStoreData: ClientState['clientData']['stores'][number]
    setSelectedStoreID: React.Dispatch<React.SetStateAction<string>>
}

const CustomiseContext = createContext<any>(null);

export const useCustomiseContext = () => {
    return useContext(CustomiseContext);
};

interface CustomiseContextProviderProps {
    children: React.ReactNode
}

export default function CustomiseContextProvider({ children }: CustomiseContextProviderProps) {
    const { clientData } = useClientContext() as ClientState;

    const [selectedStoreID, setSelectedStoreID] = useState<string>(clientData.stores[0].id);

    const selectedStoreData = useMemo(() => {
        return clientData.stores.find((store) => store.id === selectedStoreID);
    }, [selectedStoreID, clientData]);

    return (
        <CustomiseContext.Provider
            value={{
                selectedStoreID,
                selectedStoreData,
                setSelectedStoreID,
            }}
        >
            {children}
        </CustomiseContext.Provider>
    )
}