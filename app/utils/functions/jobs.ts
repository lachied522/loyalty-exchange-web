import { fetchUserRecord } from "../crud/users";
import { insertJobRecord } from "../crud/jobs";
import { refreshAllUserConnections } from "../basiq/connections";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { Job } from "@/types/basiq";

export async function createRefreshConnectionsJob(
    userID: string,
    supabase: SupabaseClient<Database>,
    serverAccessToken?: string,
): Promise<Job | null> {
    try {
        // 1. fetch user record
        const user = await fetchUserRecord(userID, supabase);
        // 2. refresh user Connections
        const job = await refreshAllUserConnections(user.basiq_user_id, serverAccessToken);
        // 3. create new job record in DB
        // if (job) {
        //     await insertJobRecord(
        //         {
        //             job_type: 'refresh-data',
        //             job_id: job.id,
        //             details: job.steps,
        //             user_id: userID,
        //         },
        //         supabase
        //     );
        // }

        return job;
    } catch (e) {
        console.error(`Error creating new refresh job for user ${userID}: `, e);
        return null;
    }
}