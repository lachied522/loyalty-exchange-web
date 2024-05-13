import { notFound } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import ClientContextProvider from "./context/ClientContext";

interface ClientIDLayoutProps {
    children: React.ReactNode
    params: { clientID: string }
}

export default async function ClientIDLayout({ children, params } : ClientIDLayoutProps) {
    const supabase = createClient();

    const { data, error } = await supabase
    .from('clients')
    .select('*, stores(*)')
    .eq('id', params.clientID);

    if (!data) {
        notFound();
    }

    return (
        <ClientContextProvider initialState={data[0]}>
            {children}
        </ClientContextProvider>
    )
}