
import { fetchUserTransactions } from "./basiq";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/supabase";
import type { ResolvedPromise } from "@/types/helpers";

export async function fetchUserData(
    userID: string,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('users')
    .select('*, points(*, stores(*, reward_types(*))), rewards(*, reward_types(*)), transactions(*)')
    .eq('id', userID);

    if (error) {
        console.log(error);
        throw new Error(`Error fecthing user data ${error}`);
    };

    // fetch transactions data from Basiq
    const recentTransactions = await fetchUserTransactions(data[0]['basiq_user_id'], 10);

    // filter out transactions based on time last updated
    const lastUpdated = data[0].last_updated? new Date(data[0].last_updated): null;
    let newTransactions;
    if (lastUpdated) {
        newTransactions = recentTransactions.filter((transaction) => (new Date(transaction.postDate) > lastUpdated));
    } else {
        newTransactions = recentTransactions;
    }

    return {
        ...data[0],
        newTransactions
    };
}

export async function fetchUserStoreRecord(
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
        console.log(error);
        throw new Error(`Error fecthing user data ${error}`);
    };

    return data? data[0]: null;
}

export async function updateUserRecord(
    record: TablesUpdate<'users'>,
    userID: string,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('users')
    .update(record)
    .eq('id', userID)
    .select('*, points(*), rewards(*), transactions(*)'); 
    
    if (error) {
        console.log(`Error updating user record: `, error);
        throw new Error(`Error updating user record ${error}`);
    };

    return data;
}

export async function fetchStoresById(
    stores: string[],
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('stores')
    .select('*, reward_types(*)')
    .in('id', stores);

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
    .select('id, vendor_name, points_rate, reward_types(*)')
    .in('vendor_name', vendorNames);

    if (error) {
        console.log(`Error fecthing store data ${error}`);
        throw new Error(`Error fecthing store data ${error}`);
    };

    return data;
}

export async function insertTransactions(
    records: TablesInsert<'transactions'>[],
    supabase: SupabaseClient<Database>
) {
    const { error } = await supabase
    .from('transactions')
    .insert(records);

    if (error) {
        console.log(`Error inserting transactions:`, error);
        throw new Error(`Error inserting transactions ${error}`);
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
        console.log(`Error updating points balance: `, error);
        throw new Error(`Error updating points balance ${error}`);
    };
}

export async function insertRewardRecord(
    record: TablesInsert<'rewards'>,
    supabase: SupabaseClient<Database>
) {
    const { error } = await supabase
    .from('rewards')
    .insert(record);

    if (error) {
        console.log(`Error updating reward: `, error);
        throw new Error(`Error updating reward ${error.message}`);
    };
}

export async function deductFromStorePoints(
    amount: number,
    storeID: string,
    userID: string,
    supabase: SupabaseClient
) {
    const { error } = await supabase
    .rpc('deduct_store_balance', { amount, store_id: storeID, user_id: userID });

    if (error) {
        console.log(`Error deducting store balance:`, error);
        throw new Error(`Error deducting store balance ${error.message}`);
    }
}

export type UserData = NonNullable<ResolvedPromise<ReturnType<typeof fetchUserData>>>;
export type StoreData = NonNullable<ResolvedPromise<ReturnType<typeof fetchStoresById>>>[number];