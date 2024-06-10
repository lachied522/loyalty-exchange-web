"use client";
import { redirect } from "next/navigation";

import { type ClientIDState, useClientIDContext } from "./context/ClientIDContext";

export default function Page() {
    const { clientData } = useClientIDContext() as ClientIDState;
    
    if (clientData.stores.length) {
        // redirect to dashboard
        redirect(`/stores/${clientData.id}/${clientData.stores[0].id}/dashboard`);
    }

    redirect(`/stores/${clientData.id}/create-store`);
}