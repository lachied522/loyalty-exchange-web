"use client";
import { createContext, useContext, useReducer, useState, useCallback } from "react";

import { createClient } from "@/utils/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

import { fetchCustomersByStoreID } from "./functions";
import { ClientReducer, type Action } from "./ClientIDReducer";

import type { Database } from "@/types/supabase";
import type { ClientData, ResolvedPromise } from "@/types/helpers";

type CustomerDataMap = {
    [storeID: string]: ResolvedPromise<ReturnType<typeof fetchCustomersByStoreID>>
}

export type ClientIDState = {
    supabase: SupabaseClient<Database>
    clientData: ClientData
    customerDataMap: CustomerDataMap

    getCustomerData: (storeID: string) => Promise<CustomerDataMap[string]>
    dispatch: React.Dispatch<Action>
}

const ClientIDContext = createContext<any>(null);

export const useClientIDContext = () => {
    return useContext(ClientIDContext);
};

interface ClientContextIDProviderProps {
    children: React.ReactNode
    initialState: ClientData
}

export default function ClientContextIDProvider({
    children,
    initialState
}: ClientContextIDProviderProps) {
    const [supabaseClient, setSupabaseClient] = useState<SupabaseClient<Database>>(createClient()); // supabase client to use for crud operations
    const [state, dispatch] = useReducer<typeof ClientReducer>(ClientReducer, initialState);

    // customer data will be dynamically fetched based on as-needed basis
    const [customerDataMap, setCustomerDataMap] = useState<CustomerDataMap>({});

    const getCustomerData = useCallback(
        async (storeID: keyof CustomerDataMap) => {
            if (storeID in customerDataMap) return customerDataMap[storeID];

            // fetch customers data and add to state
            const data = await fetchCustomersByStoreID(storeID as string);

            setCustomerDataMap((curr) => ({ ...curr, [storeID]: data }));

            return data;
        },
        [customerDataMap, setCustomerDataMap]
    );

    return (
        <ClientIDContext.Provider
            value={{
                supabase: supabaseClient,
                clientData: state,
                customerDataMap,
                getCustomerData,
                dispatch
            }}
        >
            {children}
        </ClientIDContext.Provider>
    )
}