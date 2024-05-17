import { getBasiqServerAccessToken } from "./server";

import type { Account } from "@/types/basiq";

export async function fetchAccountsByUserID(
    BasiqUserID: string | null,
    serverAccessToken?: string,
): Promise<Account[]> {
    if (!BasiqUserID) return [];

    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    const res = await fetch(
        `https://au-api.basiq.io/users/${BasiqUserID}/accounts`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            }
        }
    );

    if (!res.ok) {
        console.log('error fetching user accounts, status: ', res.status);
        return [];
    }

    return await res.json().then(({ data }) => data);
}