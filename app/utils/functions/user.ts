import {
    fetchUserPointsRecordByStoreID,
    fetchUserRecord,
    insertTransactions,
    updateUserRecord,
    upsertPointsRecords,
} from "../crud/users";
import { fetchStoreByVendorName } from "../crud/stores";

import { fetchTransactionsByUserID } from "../basiq/transactions";

import { handleClientChargesForNewTransactions } from "./billing";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
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

    const newTransactionRecords = [];
    for (const transaction of newTransactions) {
        // get store where vendor name matches transaction description
        const stores = await fetchStoreByVendorName(
            transaction.description.toUpperCase(),
            supabase
        );

        if (!(stores && stores.length)) continue;

        // NOTE: amount is negative for payments, we will store positive value
        const amount = -parseFloat(transaction.amount);
        const points = amount * GLOBAL_POINTS_RATE;

        newTransactionRecords.push({
            amount,
            points,
            date: transaction.transactionDate || transaction.postDate,
            user_id: userID,
            store_id: stores[0].id,
        });
    }

    return newTransactionRecords;
}

export async function updateUserPointsRecordsOnNewTransactions(
    userID: string,
    newTransactions: ResolvedPromise<ReturnType<typeof createTransactionRecords>>,
    supabase: SupabaseClient<Database>,
) {
    // update use points balances and insert new transaction records

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

    // update points balance at each store
    return await upsertPointsRecords(
        Array.from(pointsMap).map(([store_id, balance]) => ({
            balance,
            store_id,
            user_id: userID,
        })),
        supabase
    );
}

export async function processNewTransactions(
    userID: string,
    newTransactions: Transaction[],
    supabase: SupabaseClient<Database>,
) {
    // raw transactions data must be processed into records
    const newTransactionsRecords = await createTransactionRecords(userID, newTransactions, supabase);
    // initialise promises array
    const promises = [];

    // update user points records
    promises.push(
        updateUserPointsRecordsOnNewTransactions(
            userID,
            newTransactionsRecords,
            supabase
        )
    );

    // insert records for new transactions
    promises.push(
        insertTransactions(
            newTransactionsRecords,
            supabase
        )
    );

    // charge client for new transactions
    // this doesn't need to be awaited
    handleClientChargesForNewTransactions(newTransactionsRecords);

    await Promise.all(promises);
}

export async function refreshUserData(
    userID: string,
    supabase: SupabaseClient<Database>,
    serverAccessToken?: string,
) {
    try {
        const newTransactions = await getNewTransactionsByUserID(userID, supabase, serverAccessToken);

        let userHasNewData = false;
        if (newTransactions.length > 0) {
            await processNewTransactions(userID, newTransactions, supabase);
            userHasNewData = true;
        };

        await updateUserLastUpdated(userID, supabase);
        return userHasNewData;
    } catch (e) {
        console.error(`Error refreshing data for user ${userID}: `, e);
        return false;
    }
}