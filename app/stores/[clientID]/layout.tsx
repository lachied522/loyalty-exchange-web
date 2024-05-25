import { notFound, redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import { fetchClientByClientID } from "@/utils/crud/clients";

import ClientContextProvider from "./context/ClientIDContext";

interface ClientIDLayoutProps {
    children: React.ReactNode
    params: { clientID: string }
}

export default async function ClientIDLayout({ children, params }: ClientIDLayoutProps) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // user not logged in
        redirect('/stores/login');
    }

    const clientData = await fetchClientByClientID(params.clientID, supabase);
    if (!clientData) {
        notFound();
    }

    // check if logged in user belongs to this client
    if (user.id !== clientData.auth_user_id || clientData.id) {
        redirect('/stores/login');
    }

    return (
        <ClientContextProvider initialState={clientData}>
            {children}
        </ClientContextProvider>
    )
}