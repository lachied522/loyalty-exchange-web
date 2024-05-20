import { getBasiqServerAccessToken } from "./server";

import type { Account } from "@/types/basiq";

export async function fetchUserConnections(
    BasiqUserId: string | null,
    serverAccessToken?: string,
): Promise<Account[]> {
    if (!BasiqUserId) return [];

    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    const res = await fetch(
        `https://au-api.basiq.io/users/${BasiqUserId}/connections`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            }
        }
    );

    if (!res.ok) {
        console.log('error fetching user connections, status: ', res.status);
        return [];
    }

    return await res.json().then(({ data }) => data);
}


// see https://api.basiq.io/reference/refreshconnections-1
type RefreshAllConnectionsResponse = {
    type: 'job',
    id: string, // job id
    links: string[] // url to self
}

export async function refreshAllConnections(
    BasiqUserId: string | null,
    serverAccessToken?: string,
): Promise<RefreshAllConnectionsResponse[]> {
    // this function should not be called frequently
    if (!BasiqUserId) return [];

    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    const res = await fetch(
        `https://au-api.basiq.io/users/${BasiqUserId}/connections/refresh`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            }
        }
    );

    if (!res.ok) {
        console.log('error refreshing user connections, status: ', res.status);
        return [];
    }

    return await res.json().then(({ data }) => data);
}