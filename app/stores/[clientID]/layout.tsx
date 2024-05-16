import { notFound } from "next/navigation";

import { fetchClientData } from "@/utils/functions/clients";

import ClientContextProvider from "./context/ClientContext";

interface ClientIDLayoutProps {
    children: React.ReactNode
    params: { clientID: string }
}

export default async function ClientIDLayout({ children, params } : ClientIDLayoutProps) {

    const data = await fetchClientData(params.clientID);

    if (!data) {
        notFound();
    }

    return (
        <ClientContextProvider initialState={data}>
            {children}
        </ClientContextProvider>
    )
}