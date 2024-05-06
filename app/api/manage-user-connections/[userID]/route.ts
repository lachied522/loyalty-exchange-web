import { createClient } from '@/utils/supabase/server';
import { createBasiqUser, getClientTokenBoundToUser } from '@/lib/basiq';
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

    const userData = await fetchUserData(user.id, supabase);
    let BasiqUserID;
    if (!userData.basiq_user_id) {
        // user has not been created yet
        if (!(user.email && user.user_metadata.mobile)) {
            return Response.json({ error: 'Could not create access token. User does not have valid email or mobile.' }, { status: 400 })
        }

        // create a new Basiq user
        BasiqUserID = await createBasiqUser(user.email, user.user_metadata.mobile);

        const { error: commitError } = await supabase
        .from('users')
        .update({ 'basiq_user_id': BasiqUserID })
        .eq('id', user.id);

        if (commitError) {
            return Response.json({ error: commitError }, { status: 500 });
        }
    } else {
        BasiqUserID = userData.basiq_user_id;
    }

    // get access token bound to user
    const clientTokenBountToUser = await getClientTokenBoundToUser(BasiqUserID);

    // specify action - https://api.basiq.io/docs/consent-actions
    let action = headersList.get('action') || 'null';
    if (!userData.basiq_user_id) {
        // user must be initialised regardless of action passed in header
        action = 'null';
    }

    // return url for Consent UI
    const url = `https://consent.basiq.io/home?token=${clientTokenBountToUser}&action=${action}`;
    return Response.json({ url }, { status: 200 });
}