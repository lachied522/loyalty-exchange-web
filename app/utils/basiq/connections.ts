import { getBasiqServerAccessToken } from "./server";

import type { Account, Job } from "@/types/basiq";

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
        return [];
    }

    return await res.json().then(({ data }) => data);
}

// see https://api.basiq.io/reference/refreshconnections-1
export async function refreshAllUserConnections(
    BasiqUserId: string | null,
    serverAccessToken?: string,
): Promise<Job | null> {
    // NOTE: this function should not be called frequently
    if (!BasiqUserId) return null;

    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    const res = await fetch(
        `https://au-api.basiq.io/users/${BasiqUserId}/connections/refresh`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            }
        }
    );

    if (!res.ok) {
        return null;
    }

    return await res.json().then(({ data }) => data);
}