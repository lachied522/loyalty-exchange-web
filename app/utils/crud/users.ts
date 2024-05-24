

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/supabase";

export async function fetchUserRecord(
    userID: string,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userID);

    if (error) {
        console.error(`Error fecthing user data ${error.message}`);
        throw new Error(`Error fecthing user data ${error.message}`);
    };

    return data[0];
}

export async function fetchAllUserData(
    userID: string,
    supabase: SupabaseClient<Database>
) {
    // called when user logs in to app
    const { data, error } = await supabase
    .from('users')
    .select('*, points(*, stores(*, rewards(*))), redeemed(*, rewards(*)), transactions(*)')
    .eq('id', userID);

    if (error) {
        console.error(`Error fecthing user data ${error.message}`);
        throw new Error(`Error fecthing user data ${error.message}`);
    };

    return data[0];
}

export async function fetchUserPointsRecordByStoreID(
    userID: string,
    storeID: string,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('points')
    .select('*')
    .eq('user_id', userID)
    .eq('store_id', storeID);

    if (error) {
        console.error('Error fetching user points record: ', error.message);
        return null;
    };

    return data? data[0]: null;
}

export async function updateUserRecord(
    record: TablesUpdate<'users'>,
    userID: string,
    supabase: SupabaseClient<Database>
) {
    const { error } = await supabase
    .from('users')
    .update(record)
    .eq('id', userID); 
    
    if (error) {
        console.error(`Error updating user record: `, error.message);
        throw new Error(`Error updating user record ${error.message}`);
    };
}

export async function insertTransactions(
    records: TablesInsert<'transactions'>[],
    supabase: SupabaseClient<Database>
) {
    const { error } = await supabase
    .from('transactions')
    .insert(records);

    if (error) {
        console.error(`Error inserting transactions:`, error.message);
        throw new Error(`Error inserting transactions ${error.message}`);
    };
}

export async function upsertPointsRecords(
    records: TablesInsert<'points'>[],
    supabase: SupabaseClient<Database>
) {
    const { error } = await supabase
    .from('points')
    .upsert(records, { onConflict: 'user_id, store_id' });

    if (error) {
        console.error(`Error updating points balance: `, error.message);
        throw new Error(`Error updating points balance ${error.message}`);
    };
}

export async function insertRedeemedRecord(
    record: TablesInsert<'redeemed'>,
    supabase: SupabaseClient<Database>
) {
    const { error } = await supabase
    .from('redeemed')
    .insert(record);

    if (error) {
        console.error(`Error updating reward: `, error.message);
        throw new Error(`Error updating reward ${error.message}`);
    };
}

export async function deleteAllUserData(
    userID: string,
    supabase: SupabaseClient<Database>
) {
    const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userID);

    if (error) {
        console.error(`Error deleting user record: `, error.message);
        throw new Error(`Error deleting user record ${error.message}`);
    };
}