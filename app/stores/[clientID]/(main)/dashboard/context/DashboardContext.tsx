"use client";
import { createContext, useContext, useState, useEffect } from "react";

import { fetchCustomersByStoreID } from "./functions";

import { type ClientState, useClientContext } from "../../../context/ClientContext";

import type { ResolvedPromise } from "@/types/helpers";

type CustomerDataMap = {
    [storeID: string]: ResolvedPromise<ReturnType<typeof fetchCustomersByStoreID>>
}

export type DashboardState = {
    customerDataMap: CustomerDataMap
    selectedStoreID: keyof CustomerDataMap
    setCustomerDataMap: React.Dispatch<React.SetStateAction<CustomerDataMap>>
    setSelectedStoreID: React.Dispatch<React.SetStateAction<keyof CustomerDataMap>>
    getCustomersData: (storeID: keyof CustomerDataMap) => Promise<CustomerDataMap[keyof CustomerDataMap]>
}

const DashboardContext = createContext<any>(null);

export const useDashboardContext = () => {
    return useContext(DashboardContext);
};

interface DashboardContextProviderProps {
    children: React.ReactNode
}

export default function DashboardContextProvider({ children }: DashboardContextProviderProps) {
    const { clientData } = useClientContext() as ClientState;

    const [customerDataMap, setCustomerDataMap] = useState<CustomerDataMap>({});
    const [selectedStoreID, setSelectedStoreID] = useState<string>(clientData.stores[0].id);

    useEffect(() => {
        getCustomersData(selectedStoreID);
    }, [selectedStoreID]);

    const getCustomersData = async (storeID: keyof CustomerDataMap) => {
        if (storeID in setCustomerDataMap) return;

        // fetch customers data and add to state
        const data = await fetchCustomersByStoreID(storeID as string);

        setCustomerDataMap((curr) => ({ ...curr, [storeID]: data }));
    }

    return (
        <DashboardContext.Provider
            value={{
                customerDataMap,
                selectedStoreID,
                getCustomersData,
                setCustomerDataMap,
                setSelectedStoreID,
            }}
        >
            {children}
        </DashboardContext.Provider>
    )
}