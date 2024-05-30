import { getBasiqServerAccessToken } from "./server";
import { fetchBasiqAccountsByUserID } from "./accounts";

import type { Transaction } from "@/types/basiq";

export async function fetchTransactionsByAccountID(
    BasiqUserID: string | null,
    BasiqAccountID: string,
    limit: number = 10,
    serverAccessToken?: string,
): Promise<Transaction[]> {
    if (!BasiqUserID) return [];

    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    // we will limit number of transactions to fetch
    // it is possible we miss some transactions by doing this
    const res = await fetch(
        `https://au-api.basiq.io/users/${BasiqUserID}/transactions?limit=${limit}&filter=account.id.eq('${BasiqAccountID}')`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            }
        }
    );

    if (!res.ok) {
        console.log('error fetching user transactions, status: ', res.status);
        return [];
    }

    return await res.json().then(({ data }) => data);
}

export async function fetchTransactionsByUserID(
    BasiqUserID: string | null,
    limit: number = 10,
    serverAccessToken?: string,
): Promise<Transaction[]> {
    // see https://api.basiq.io/reference/gettransactions
    // selecting all transactions without filtering by account ID results in some accounts being missed
    // we will first fetch all user accounts and then fetch transactions one by one
    if (!BasiqUserID) return [];

    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    // fetch user accounts
    const accounts = await fetchBasiqAccountsByUserID(BasiqUserID, serverAccessToken);

    // initialise promises array
    const promises = [];

    for (const account of accounts) {
        promises.push(fetchTransactionsByAccountID(BasiqUserID, account.id, limit, serverAccessToken));
    }

    const data = (await Promise.all(promises)).flat();
    return data.sort((a, b) => (
        (new Date(b.transactionDate).getTime() || new Date(b.postDate).getTime()) - 
        (new Date(a.transactionDate).getTime() || new Date(a.postDate).getTime())
    ));
}