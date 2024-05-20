import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export async function fetchClientByStoreID(
    storeID: string,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('stores')
    .select('id, clients(*)')
    .eq('id', storeID);

    if (error) {
        console.log(`Error fecthing client data: ${error}`);
        throw new Error(`Error fecthing client data: ${error}`);
    };

    return data[0].clients;
}

export async function fetchClientByClientID(
    clientID: string,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientID);

    if (error) {
        console.log(`Error fecthing client data: ${error}`);
        throw new Error(`Error fecthing client data: ${error}`);
    };

    return data[0];
}

export async function updateClientStripeCustomerID(
    clientID: string,
    value: string,
    supabase: SupabaseClient<Database>,
) {
    const { error } = await supabase
    .from('clients')
    .update({ 'stripe_customer_id': value })
    .eq('id', clientID);

    if (error) {
        console.log(`Error updating client Stripe customer ID: ${error}`);
        throw new Error(`Error updating client Stripe customer ID: ${error}`);
    };
}