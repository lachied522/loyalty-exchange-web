import { createClient } from '@/utils/supabase/server';
import { fetchBasiqAccountsByUserID } from '@/utils/basiq/accounts';

import { getAuthenticatedUser } from '@/api/auth';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    // create a new Basiq access token and bind it to the user
    const user = await getAuthenticatedUser(params.userID);

    if (!user) {
        return Response.json({} , { status: 401 })
    }

    try {
        // get basiq user id
        const supabase = createClient();
        const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('basiq_user_id')
        .eq('id', params.userID);

        if (fetchError) throw fetchError;
        // get basiq accounts by basiq user id
        const data = await fetchBasiqAccountsByUserID(userData[0].basiq_user_id);
        return Response.json({ data }, { status: 200 });
    } catch (error) {
        console.log('error in get user accounts route: ', error)
        return Response.json({ error }, { status: 500 });
    }

}