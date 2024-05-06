import {
    fetchStoresByVendorName,
    fetchUserData,
    insertTransactions,
    insertRewardRecord,
    updateUserRecord,
    upsertPointsRecords,
    fetchUserStoreRecord,
} from "@/lib/crud";

import type { Transaction } from "@/lib/basiq";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";
import type { ResolvedPromise, Reward } from "@/types/helpers";


export async function createTransactionRecords(
    transactions: Transaction[],
    storeData: ResolvedPromise<ReturnType<typeof fetchStoresByVendorName>>,
    userID: string,
) {
    // create new transaction  records by merging transactions from Basiq api with store data and user ID
    if (transactions.length === 0) return [];
    
    function reducer(acc: Omit<Tables<'transactions'>, 'id'>[], obj: Transaction) {
        const store = storeData.find((store) => store.vendor_name === obj.description);

        if (!store) return acc;

        const amount = parseFloat(obj.amount);
        const points = Math.abs(amount) * store.points_rate;

        return [
            ...acc,
            {
                amount,
                points,
                date: obj.postDate,
                user_id: userID,
                store_id: store.id,
            }
        ]
    }

    return transactions.reduce(reducer, []);
}

export async function processNewTransactions(
    newTransactions: ResolvedPromise<ReturnType<typeof createTransactionRecords>>,
    userData: ResolvedPromise<ReturnType<typeof fetchUserData>>,
    storeData: ResolvedPromise<ReturnType<typeof fetchStoresByVendorName>>,
    supabase: SupabaseClient<Database>,
) {
    // calculate new points balance for each store
    let totalSpend = 0;
    const pointsMap = new Map<string, number>();
    for (const transaction of newTransactions) {
        const currentBalance = userData.points.find((obj) => transaction.store_id === obj.store_id)?.balance || 0;
        pointsMap.set(transaction.store_id, currentBalance + transaction.points! + (pointsMap.get(transaction.store_id) || 0));

        totalSpend += Math.abs(transaction.amount!);
    }

    // initialise promises array
    const promises = [];

    // update points balance at each store
    promises.push(upsertPointsRecords(
        Array.from(pointsMap).map(([store_id, balance]) => ({
            balance,
            store_id,
            user_id: userData.id,
        })),
        supabase
    ));

    // insert records for new transactions
    promises.push(insertTransactions(newTransactions, supabase));

    // update user points balance and last_updated columns
    const POINTS_CONVERSION_RATE = 10;
    promises.push(updateUserRecord(
        {
            points_balance: userData.points_balance + totalSpend * POINTS_CONVERSION_RATE,
            last_updated: new Date().toISOString(),
        },
        userData.id,
        supabase
    ));

    return await Promise.all(promises)
    .then(() => true)
    .catch((e) => {
        console.log('error refreshing user data:', e);
        return false;
    });
}

export async function refreshUserData(
    userID: string,
    supabase: SupabaseClient<Database>
) {
    const userData = await fetchUserData(userID, supabase);

    if (userData.newTransactions.length === 0) return false;

    const storeData = await fetchStoresByVendorName(
        userData.newTransactions.map((transaction) => transaction.description.toUpperCase()),
        supabase
    );

    const newTransactions = await createTransactionRecords(userData.newTransactions, storeData, userData.id);
    
    return await processNewTransactions(newTransactions, userData, storeData, supabase);
}

export async function redeemReward(
    reward: Reward,
    userID: string,
    supabase: SupabaseClient<Database>
) {
    // Step 1: check if user has sufficient points
    const pointsRecord = await fetchUserStoreRecord(userID, reward.store_id, supabase);
    const balance = pointsRecord?.balance || 0;

    if (balance < reward.cost) {
        return false;
    }

    const promises = [];
    // Step 2: adjust user's points balance at store
    promises.push(
        upsertPointsRecords(
            [{
                balance: balance - reward.cost,
                store_id: reward.store_id,
                user_id: userID,
            }],
            supabase
        )
    );

    // Step 3: insert new reward record
    promises.push(
        insertRewardRecord(
            {
                reward_type_id: reward.id,
                user_id: userID,
                redeemed_at: new Date().toISOString(),
            },
            supabase
        )
    );

    return await Promise.all(promises)
    .then(() => true)
    .catch((e) => {
        console.log('error redeeming reward:', e);
        return false;
    });
}
