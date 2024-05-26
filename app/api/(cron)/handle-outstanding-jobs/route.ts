import { createClient } from '@/utils/supabase/server';

import { deleteJobRecord, fetchAllJobRecords } from '@/utils/crud/jobs';
import { deleteAllUserData } from '@/utils/crud/users';
import { deleteBasiqUser } from '@/utils/basiq/users';

import type { Database, Tables } from '@/types/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

async function handleDeleteUserJob(
    jobID: number,
    userID: string,
    supabase: SupabaseClient<Database>
) {
    try {
        // 1. retreive user record
        const { data: userData, error: userError } = await supabase
        .from('users')
        .select('basiq_user_id')
        .eq('id', userID);

        if (userError) {
            throw userError;
        }
        // 2. Delete Basiq user
        let isBasiqUserDeleted = true; // default to true, will be made false if below fails
        if (userData && userData.length && userData[0].basiq_user_id) {
            isBasiqUserDeleted = await deleteBasiqUser(userData[0].basiq_user_id);
            // TO DO: handle case where Basiq user is not deleted
        }
        // 3. delete user from 'public' table
        await deleteAllUserData(userID, supabase)
        // 4. delete user from 'auth' table
        await supabase.auth.admin.deleteUser(userID);
        // 5. delete job record
        await deleteJobRecord(jobID, supabase);
    } catch (e) {
        // pass
    }
}

export async function GET(req: Request) {
    // docs: https://vercel.com/docs/cron-jobs/manage-cron-jobs
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        const supabase = createClient();

        // get all job records
        const data = await fetchAllJobRecords(supabase);

        if (!data) {
            return Response.json({}, { status: 200 });
        }
    
        const queue: Promise<any>[] = [];
        for (const job of data) {
            if (queue.length > 10) {
                await queue.shift();
            }

            if (job.job_type === 'delete-user' && job.user_id) {
                queue.push(handleDeleteUserJob(job.id, job.user_id, supabase));
            }
        }
    
        await Promise.all(queue);
    
        console.log('Outstanding jobs complete.');
        return Response.json({}, { status: 200 });
    } catch (e) {
        console.error('Error in handle outstanding jobs route: ', e);
        return Response.json({}, { status: 200 });
    }
}