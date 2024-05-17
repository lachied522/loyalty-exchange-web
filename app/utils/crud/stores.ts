
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

export async function fetchStoresById(
    storeIDs: string[],
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('stores')
    .select('*, rewards(*)')
    .in('id', storeIDs);

    if (error) {
        console.log(`Error fecthing store data ${error}`);
    };

    return data;
}

export async function fetchStoresByVendorName(
    vendorNames: string[],
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('stores')
    .select('id, vendor_name, rewards(*)')
    .in('vendor_name', vendorNames);

    if (error) {
        console.log(`Error fecthing store data ${error}`);
        throw new Error(`Error fecthing store data ${error}`);
    };

    return data;
}