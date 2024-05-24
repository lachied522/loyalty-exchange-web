import { getBasiqServerAccessToken } from "./server";

import type { Job } from "@/types/basiq";

export async function fetchBasiqJobByJobID(
    BasiqJobID: string | null,
    serverAccessToken?: string,
): Promise<Job | null> {
    if (!BasiqJobID) return null;

    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    const res = await fetch(
        `https://au-api.basiq.io/jobs/${BasiqJobID}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            }
        }
    );

    if (!res.ok) {
        console.error('error retrieving job, status: ', res.status);
        return null;
    }

    return await res.json();
}

export async function fetchBasiqJobsByUserID(
    BasiqUserID: string | null,
    serverAccessToken?: string,
): Promise<Job[] | null> {
    if (!BasiqUserID) return null;

    if (!serverAccessToken) {
        serverAccessToken = await getBasiqServerAccessToken();
    }

    const res = await fetch(
        `https://au-api.basiq.io/users/${BasiqUserID}/jobs`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${serverAccessToken}`,
                'Accept': 'application/json',
            }
        }
    );

    if (!res.ok) {
        console.error('error retrieving job, status: ', res.status);
        return null;
    }

    // sort data by created
    const { data }: { data: Job[] } = await res.json();
    return data.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
}