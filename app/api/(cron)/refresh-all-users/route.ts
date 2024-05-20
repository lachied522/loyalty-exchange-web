// docs: https://vercel.com/docs/cron-jobs/manage-cron-jobs

import { createClient } from '@/utils/supabase/server';
import { refreshUserData } from '@/utils/functions/user';
import { getBasiqServerAccessToken } from '@/utils/basiq/server';

export async function GET(req: Request) {

    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    const supabase = createClient();

    // get all user records
    const { data, error } = await supabase
    .from('users')
    .select('id, last_updated');

    if (error) {
        // user not signed in
        return Response.json({} , { status: 500 });
    }

    // get server access token
    const serverAccessToken = await getBasiqServerAccessToken();

    // for each user, check if last update was greater than 24 hours ago
    const now = new Date().getTime();
    const day = 1000 * 60 * 60 * 24;
    const queue: Promise<boolean>[] = [];
    for (const user of data) {
        const lastUpdated = user.last_updated? new Date(user.last_updated): null;
        if (!lastUpdated || now - lastUpdated.getTime() > day) {

            if (queue.length > 10) {
                await queue.shift();
            }

            queue.push(refreshUserData(user.id, supabase, serverAccessToken));
        }
    }

    await Promise.all(queue)
    .catch((e) => {
        console.log('Error refresing user data: ', e);
    });

    console.log('User data refreshed.');
    return Response.json({}, { status: 200 });
}