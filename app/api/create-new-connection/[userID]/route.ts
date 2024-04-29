import { createClient } from '@/utils/supabase/server';
import { createBasiqUser, getBasiqServerAccessToken, getClientTokenBoundToUser } from '@/lib/basiq';

import { headers } from 'next/headers';

export async function GET(
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

    if (!(user.email && user.user_metadata.mobile)) {
        return Response.json({ error: 'User does not have valid email or mobile' }, { status: 400 })
    }

    // step 1: create Basiq user
    const BasiqUserID = await createBasiqUser(user.email, user.user_metadata.mobile);

    // step 2: get client access token bounded to user
    const clientTokenBountToUser = await getClientTokenBoundToUser(BasiqUserID);

    // step 3: store access token in Supabase
    const { error: commitError } = await supabase
    .from('users')
    .update({ 'basiq_user_id': BasiqUserID })
    .eq('id', user.id);

    if (commitError) {
        return Response.json({ error: commitError }, { status: 500 });
    }

    // return url for Consent UI
    const url = `https://consent.basiq.io/home?token=${clientTokenBountToUser}&action=null`;
    return Response.json({ url }, { status: 200 });
}