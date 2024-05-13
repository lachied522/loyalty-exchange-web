"use client";
import { createContext, useContext, useState } from "react";

import type { ClientData } from "@/types/helpers";

export type ClientState = {
    clientData: ClientData
    setClientData: React.Dispatch<React.SetStateAction<ClientData>>
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
    const [clientData, setClientData] = useState(initialState);

    return (
        <ClientContext.Provider
            value={{
                clientData,
                setClientData,
            }}
        >
            {children}
        </ClientContext.Provider>
    )
}