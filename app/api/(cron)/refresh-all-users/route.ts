// docs: https://vercel.com/docs/cron-jobs/manage-cron-jobs

import { refreshUserData } from '@/utils/functions/user';
import { createClient } from '@/utils/supabase/server';

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

    // for each user, check if last update was greater than one hour ago
    const now = new Date().getTime();
    const hour = 1000 * 60 * 60;
    const queue: Promise<boolean>[] = [];
    for (const user of data) {
        const lastUpdated = user.last_updated? new Date(user.last_updated): null;
        if (!lastUpdated || lastUpdated.getTime() > now - hour) {

            if (queue.length > 10) {
                await queue[0];
            }

            queue.push(refreshUserData(user.id, supabase));
        }
    }

    await Promise.all(queue)
    .catch((e) => {
        console.log('Error refresing user data: ', e);
    });

    console.log('User data refreshed.');
    return Response.json({}, { status: 200 });
}