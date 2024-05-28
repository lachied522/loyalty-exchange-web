"use client";
import { createContext, useContext, useState, useEffect } from "react";

import { type StoreIDState, useStoreIDContext } from "../../context/StoreIDContext";
import { type ClientIDState, useClientIDContext } from "../../../context/ClientIDContext";

type CustomerData = ClientIDState['customerDataMap'][string]

export type DashboardState = {
    customerData: CustomerData | null
    isLoading: boolean
}

const DashboardContext = createContext<any>(null);

export const useDashboardContext = () => {
    return useContext(DashboardContext);
};

interface DashboardContextProviderProps {
    children: React.ReactNode
}

export default function DashboardContextProvider({ children }: DashboardContextProviderProps) {
    const { getCustomerData } = useClientIDContext() as ClientIDState;
    const { storeID } = useStoreIDContext() as StoreIDState;
    const [customerData, setCustomerData] = useState<CustomerData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        getCustomerDataForStore();

        async function getCustomerDataForStore() {
            const data = await getCustomerData(storeID);

            if (isMounted) {
                setCustomerData(data);
                setIsLoading(false);
            }
        }

        return () => {
            isMounted = false;
        }
    }, [storeID, getCustomerData, setCustomerData, setIsLoading]);

    return (
        <DashboardContext.Provider
            value={{
                customerData,
                isLoading
            }}
        >
            {children}
        </DashboardContext.Provider>
    )
}