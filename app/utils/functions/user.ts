import {
    deductStoreBalance,
    fetchStoresByVendorName,
    fetchUserData,
    insertTransactions,
    updateRewardRecord,
    updateUserRecord,
    upsertPointsRecords,
    type UserData
} from "@/lib/crud";

import type { Transaction } from "@/lib/basiq";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";
import type { Reward } from "@/types/helpers";

export async function createTransactionRecords(
    transactions: Transaction[],
    userID: string,
    supabase: SupabaseClient<Database>
) {
    // create new transaction records by merging transactions from Basiq api with store data and user ID
    if (transactions.length === 0) return [];

    // get records for relevant stores
    const stores = await fetchStoresByVendorName(
        transactions.map((transaction) => transaction.description.toUpperCase()),
        supabase
    );
    
    function reducer(acc: Omit<Tables<'transactions'>, 'id'>[], obj: Transaction) {
        const store = stores.find((store) => store.vendor_name === obj.description);

        if (!store) return acc;

        // calculate points
        const points = Math.abs(parseFloat(obj.amount)) * store.points_rate;

        return [
            ...acc,
            {
                amount: parseFloat(obj.amount),
                date: obj.postDate,
                points: points,
                store_id: store.id,
                user_id: userID
            }
        ]
    }

    return transactions.reduce(reducer, []);
}

export async function refreshUserData(userID: string, supabase: SupabaseClient<Database>) {
    // update user points balances based on recent transactions
    // this should be done on the server

    // Step 1: fetch user data
    const data = await fetchUserData(userID, supabase);

    // Step 2: create records for any new transactions
    const newTransactions = await createTransactionRecords(data.newTransactions, data.id, supabase);

    if (newTransactions.length === 0) return false;

    // Step 3: sum points balance for each store
    let totalSpend = 0;
    const pointsMap = new Map<string, number>();
    for (const transaction of newTransactions) {
        totalSpend += Math.abs(transaction.amount!);
        pointsMap.set(transaction.store_id, (pointsMap.get(transaction.store_id) || 0) + transaction.points!);
    }

    const promises = [];
    // Step 4: upsert points records for each store
    promises.push(upsertPointsRecords(
        Array.from(pointsMap).map(([store, balance]) => ({
            balance,
            store_id: store,
        })),
        userID,
        supabase
    ));

    // Step 5: insert records for new transactions
    promises.push(insertTransactions(newTransactions, supabase));

    // step 6: update user points balance and last_updated columns
    const POINTS_CONVERSION_RATE = 10;
    promises.push(updateUserRecord(
        {
            points_balance: data.points_balance + totalSpend * POINTS_CONVERSION_RATE,
            last_updated: new Date().toISOString(),
        },
        userID,
        supabase
    ));

    return await Promise.all(promises)
    .then(() => true)
    .catch((e) => {
        console.log('error refreshing user data:', e);
        return false;
    });
}

export async function redeemReward(
    reward: Reward,
    userID: string,
    supabase: SupabaseClient<Database>
) {
    // Step 1: set redeemed column to true
    await updateRewardRecord(
        {
            id: reward.id,
            redeemed: true,
            redeemed_at: new Date().toISOString(),
        },
        supabase
    );

    // Step 2: adjust user's points balance at store
    return await deductStoreBalance(
        reward.reward_types!.cost,
        reward.reward_types!.store_id,
        userID,
        supabase
    )
}
