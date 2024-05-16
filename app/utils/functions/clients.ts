"use server";

import { createClient } from "../supabase/server";

import type { ResolvedPromise } from "@/types/helpers";

export async function fetchClientData(clientID: string) {
    const supabase = createClient();

    const { data, error } = await supabase
    .from('clients')
    .select('*, stores(*, reward_types(*))')
    .eq('id', clientID);

    if (error) {
        console.log('Error fetching client data: ', error);
        return;
    }

    return data[0];
}


export type ClientData = NonNullable<ResolvedPromise<ReturnType<typeof fetchClientData>>>;