import { headers } from 'next/headers';

import { createClient } from '@/utils/supabase/server';

async function getUser(token: string | null) {
    const supabase = createClient();

    if (token) {
        return await supabase.auth.getUser(token);
    }

    return await supabase.auth.getUser();
}


export async function isRequestAuthenticated(userID: string) {
    // authenticate an api request
    // request can come from mobile or web
    // if mobile, token is passed as header
    const headersList = headers();
    const token = headersList.get('token');

    // user is null if no session
    const { data: { user } } = await getUser(token);

    // check if authenticated user is same the one making the request
    if (user && userID === user.id) {
        return true;
    }

    return false;
}