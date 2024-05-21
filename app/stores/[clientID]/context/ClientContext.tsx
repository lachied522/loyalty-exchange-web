"use client";
import { createContext, useContext, useReducer } from "react";

import { createClient } from "@/utils/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

import { ClientReducer, type Action } from "./ClientReducer";

import type { ClientData } from "@/utils/functions/clients";
import type { Database } from "@/types/supabase";

export type ClientState = {
    supabase: SupabaseClient<Database>
    clientData: ClientData
    dispatch: React.Dispatch<Action>
}

const ClientContext = createContext<any>(null);

export const useClientContext = () => {
    return useContext(ClientContext);
};

interface ClientContextProviderProps {
    children: React.ReactNode
    initialState: ClientData
}

export default function ClientContextProvider({ children, initialState }: ClientContextProviderProps) {
    const [state, dispatch] = useReducer<typeof ClientReducer>(ClientReducer, initialState);
    // create supabase client to use for crud operations
    const supabase = createClient();

    return (
        <ClientContext.Provider
            value={{
                supabase,
                clientData: state,
                dispatch
            }}
        >
            {children}
        </ClientContext.Provider>
    )
}