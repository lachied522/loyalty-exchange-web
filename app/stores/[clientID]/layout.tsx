import { redirect } from "next/navigation";

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

    if (!(user && user.id === params.clientID)) {
        // user not logged in
        redirect('/stores/login');
    }

    if (user.user_metadata['role'] !== 'client') {
        // user not set up as client
        redirect('/stores/login');
    }

    const clientData = await fetchClientByClientID(params.clientID, supabase);
    if (!clientData) {
        redirect('/stores/signup');
    }

    return (
        <ClientContextProvider initialState={clientData}>
            {children}
        </ClientContextProvider>
    )
}