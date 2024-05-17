import {
    fetchUserPointsRecordByStoreID,
    fetchUserRecord,
    insertTransactions,
    updateUserRecord,
    upsertPointsRecords,
} from "../crud/users";
import { fetchStoresByVendorName } from "../crud/stores";

import { fetchTransactionsByUserID } from "../basiq/transactions";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/supabase";
import type { Transaction } from "@/types/basiq";

import type { ResolvedPromise } from "@/types/helpers";

const GLOBAL_POINTS_RATE = 10;

export async function updateUserLastUpdated(
    userID: string,
    supabase: SupabaseClient<Database>
) {
    // update the 'last_updated' column in user record
    return await updateUserRecord(
        { last_updated: new Date().toISOString() },
        userID,
        supabase
    )
}

export async function getNewTransactionsByUserID(
    userID: string,
    supabase: SupabaseClient<Database>,
    serverAccessToken?: string
) {
    try {
        const user = await fetchUserRecord(userID, supabase);

        // fetch transactions data from Basiq
        const recentTransactions = await fetchTransactionsByUserID(user.basiq_user_id, 10, serverAccessToken);

        // filter out transactions based on time last updated
        const lastUpdated = user.last_updated? new Date(user.last_updated): null;
        let newTransactions;
        if (lastUpdated) {
            newTransactions = recentTransactions.filter(
                (transaction) => (
                    new Date(transaction.transactionDate || transaction.postDate) > lastUpdated
                )
            );
        } else {
            newTransactions = recentTransactions;
        }

        return newTransactions;
    } catch (e) {
        console.log(`Error getting new transactions for user ${userID}: `, e);
        return [];
    }
}

export async function createTransactionRecords(
    userID: string,
    newTransactions: Transaction[],
    supabase: SupabaseClient<Database>,
) {
    // create new transaction records by merging transactions from Basiq api with store data and user ID
    if (newTransactions.length === 0) return [];

    // get stores where vendor name matches transaction description
    const storeData = await fetchStoresByVendorName(
        newTransactions.map((transaction) => transaction.description.toUpperCase()),
        supabase
    );

    function reducer(acc: Omit<Tables<'transactions'>, 'id'>[], obj: Transaction) {
        const store = storeData.find((store) => store.vendor_name === obj.description);

        if (!store) return acc;

        const amount = parseFloat(obj.amount);
        const points = amount * GLOBAL_POINTS_RATE;

        return [
            ...acc,
            {
                amount,
                points,
                date: obj.transactionDate,
                user_id: userID,
                store_id: store.id,
            }
        ]
    }

    return newTransactions.reduce(reducer, []);
}

export async function processNewTransactions(
    userID: string,
    newTransactions: ResolvedPromise<ReturnType<typeof createTransactionRecords>>,
    supabase: SupabaseClient<Database>,
) {
    // calculate new points balance for each store
    let totalSpend = 0;
    const pointsMap = new Map<string, number>(); // { store_id: balance } for each transaction
    for (const transaction of newTransactions) {
        if (!pointsMap.has(transaction.store_id)) {
            // initialise points balance to current balance if any
            const userPointsRecord = await fetchUserPointsRecordByStoreID(userID, transaction.store_id, supabase);
            
            pointsMap.set(transaction.store_id, userPointsRecord?.balance || 0);
        }

        pointsMap.set(transaction.store_id, transaction.points + pointsMap.get(transaction.store_id)!);

        totalSpend += Math.abs(transaction.amount!);
    }

    // initialise promises array
    const promises = [];

    // update points balance at each store
    promises.push(
        upsertPointsRecords(
            Array.from(pointsMap).map(([store_id, balance]) => ({
                balance,
                store_id,
                user_id: userID,
            })),
            supabase
        )
);

    // insert records for new transactions
    promises.push(insertTransactions(newTransactions, supabase));

    // update user last_updated column
    promises.push(
        updateUserLastUpdated(
            userID,
            supabase
        )
    );

    return await Promise.all(promises)
    .then(() => true)
    .catch((e) => {
        console.log('error refreshing user data:', e);
        return false;
    });
}

export async function refreshUserData(
    userID: string,
    supabase: SupabaseClient<Database>,
    serverAccessToken?: string,
) {
    try {
        const newTransactions = await getNewTransactionsByUserID(userID, supabase, serverAccessToken);

        if (newTransactions.length === 0) {
            // update last_updated column and return false
            await updateUserLastUpdated(userID, supabase);
            return false;
        };
    
        const newTransactionsRecords = await createTransactionRecords(userID, newTransactions, supabase);
        
        return await processNewTransactions(userID, newTransactionsRecords, supabase);
    } catch (e) {
        console.log(`Error refreshing data for user ${userID}: `, e);
        return false;
    }
}

