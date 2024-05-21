
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesUpdate } from "@/types/supabase";

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

export async function fetchStoreByVendorName(
    vendorName: string,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase.rpc('search_vendor_names', { query: vendorName.toUpperCase() });

    if (error) return null;

    return data;
}

export async function updateStoreRecord(
    record: TablesUpdate<'stores'>,
    storeID: string,
    supabase: SupabaseClient<Database>,
) {
    const { error } = await supabase
    .from('stores')
    .update(record)
    .eq('id', storeID);

    if (error) {
        console.log(`Error updating store record: `, error);
        throw new Error(`Error updating store record ${error}`);
    };
}