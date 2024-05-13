import { createClient } from '@/utils/supabase/server';
import { fetchUserAccounts } from '@/lib/basiq';
import { fetchUserData } from '@/lib/crud';

import { isRequestAuthenticated } from '@/api/auth';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    // create a new Basiq access token and bind it to the user
    const isAuthenticated = await isRequestAuthenticated(params.userID);

    if (!isAuthenticated) {
        return Response.json({} , { status: 401 })
    }

    const supabase = createClient();

    // get user record
    const userData = await fetchUserData(params.userID, supabase);

    // fetch user account
    try {
        const data = await fetchUserAccounts(userData.basiq_user_id);
        
        return Response.json({ data }, { status: 200 });
    } catch (error) {
        console.log('error in get user accounts route: ', error)
        return Response.json({ error }, { status: 500 });
    }

}