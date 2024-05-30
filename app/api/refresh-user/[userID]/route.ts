import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

import { createClient } from '@/utils/supabase/server';

import { getAuthenticatedUser } from '@/api/auth';
import { createRefreshConnectionsJob } from '@/utils/functions/jobs';
import { fetchBasiqJobByJobID, fetchBasiqJobsByUserID } from '@/utils/basiq/jobs';
import { getBasiqServerAccessToken } from '@/utils/basiq/server';
import { refreshUserData } from '@/utils/functions/user';
import { fetchAllUserData, fetchUserRecord } from '@/utils/crud/users';

// create refresh jobs should be limited to one per hour
const CREATE_NEW_REFRESH_JOB_LIMIT = 60 * 60 * 1000; // one hour
// we will also rate limit this route on a per user, and total request basis
// see https://vercel.com/guides/rate-limiting-edge-middleware-vercel-kv
const ratelimit = {
    users: new Ratelimit({
        redis: kv,
        prefix: "ratelimit:users",
        limiter: Ratelimit.slidingWindow(1, '5 m'),
    }),
    total: new Ratelimit({
        redis: kv,
        prefix: "ratelimit:total",
        limiter: Ratelimit.slidingWindow(12, '5 m'),
    }),
}

async function checkUserLimit(userID: string) {
    const { success } = await ratelimit.users.limit(userID);
    return success;
}

async function checkTotalLimit() {
    const { success } = await ratelimit.total.limit('total-requests');
    return success;
}

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    // prevent route from running in development
    if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
        return Response.json({ hasNewData: false, data: null });
    }

    const [userSuccess, totalSuccess] = await Promise.all([
        checkUserLimit(params.userID),
        checkTotalLimit()
    ]);

    if (!(userSuccess && totalSuccess)) {
        return Response.json({}, { status: 429 });
    }

    const user = await getAuthenticatedUser(params.userID);

    if (!user) {
        return Response.json({} , { status: 401 });
    }

    try {
        const supabase = createClient();
        const serverAccessToken = await getBasiqServerAccessToken();
        // 1. fetch user record
        const user = await fetchUserRecord(params.userID, supabase);

        if (!user.basiq_user_id) {
            // Basiq is not linked to user
            return Response.json({ error: 'User has not linked any accounts' }, { status: 400 });
        }
        // 2. fetch user jobs and check for time of most recent job
        const allJobs = await fetchBasiqJobsByUserID(user.basiq_user_id, serverAccessToken);
        const now = new Date();
        const lastJobCreated = allJobs? new Date(allJobs[0].updated): new Date(0);
        
        if (
            !allJobs ||
            !allJobs.length ||
            now.getTime() - lastJobCreated.getTime() > CREATE_NEW_REFRESH_JOB_LIMIT
        ) {
            // 3i. create a new refresh job
            const newJob = await createRefreshConnectionsJob(params.userID, supabase, serverAccessToken);

            if (!newJob) {
                return Response.json({ error: 'Failed to create new job' }, { status: 500 });
            }

            console.log('New refresh job created');
            return Response.json({ hasNewData: false, data: null }, { status: 200 });
        }

        // 3ii. check status of Basiq job
        const BasiqJobID = allJobs[0].id;
        const currentJob = await fetchBasiqJobByJobID(BasiqJobID, serverAccessToken);

        if (!currentJob) {
            return Response.json({ error: 'Something went wrong retrieving job' }, { status: 500 });
        }

        // job is complete if status of all steps is success
        if (!currentJob.steps.reduce((acc, obj) => acc && obj.status === 'success', true)) {
            return Response.json({ hasNewData: false, data: null }, { status: 200 });
        }

        // 4. update user data in DB
        const hasNewData = await refreshUserData(params.userID, supabase, serverAccessToken);

        if (!hasNewData) {
            return Response.json({ hasNewData: false, data: null }, { status: 200 });
        }
        
        // 5. return new data if any
        const data = await fetchAllUserData(params.userID, supabase);

        return Response.json({ hasNewData: hasNewData, data }, { status: 200 });
    } catch (error) {
        console.error('error in refresh user route: ', error);
        return Response.json({ error }, { status: 500 });
    }
}