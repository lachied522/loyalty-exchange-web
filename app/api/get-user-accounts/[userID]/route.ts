import { createClient } from '@/utils/supabase/server';
import { fetchUserAccounts } from '@/lib/basiq';
import { fetchUserData } from '@/lib/crud';

import { headers } from 'next/headers';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    // create a new Basiq access token and bind it to the user
    const headersList = headers();
    const token = headersList.get('token');

    if (!token) {
        return Response.json({} , { status: 401 });
    }

    const supabase = createClient();

    // get user from token
    const { data: { user } } = await supabase.auth.getUser(token);

    // check that userID belongs to user with token
    if (!(user && params.userID === user.id)) {
        return Response.json({} , { status: 401 });
    }

    // get user record
    const userData = await fetchUserData(user.id, supabase);

    // fetch user account
    const data = await fetchUserAccounts(userData.basiq_user_id);

    return Response.json({ data }, { status: 200 });
}