import { notFound } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import { fetchClientByClientID } from "@/utils/crud/clients";

import ClientContextProvider from "./context/ClientIDContext";

interface ClientIDLayoutProps {
    children: React.ReactNode
    params: { clientID: string }
}

export default async function ClientIDLayout({ children, params }: ClientIDLayoutProps) {
    const supabase = createClient();
    const data = await fetchClientByClientID(params.clientID, supabase);

    if (!data) {
        notFound();
    }

    return (
        <ClientContextProvider initialState={data}>
            {children}
        </ClientContextProvider>
    )
}