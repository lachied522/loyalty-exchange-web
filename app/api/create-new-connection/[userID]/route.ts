// this route will be merged with manage-user-connections
import { createClient } from '@/utils/supabase/server';

import { getAuthenticatedUser } from '@/api/auth';

import { createBasiqUser, getClientTokenBoundToUser } from '@/utils/basiq/users';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    // create a new Basiq access token and bind it to the user
    const user = await getAuthenticatedUser(params.userID);

    if (!user) {
        return Response.json({} , { status: 401 })
    }

    if (!(user.email && user.user_metadata.mobile)) {
        return Response.json({ error: 'User does not have valid email or mobile' }, { status: 400 })
    }

    try {
        // step 0: check if user already has a basiq
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
        .from('users')
        .select('basiq_user_id')
        .eq('id', params.userID);

        if (fetchError) throw fetchError;

        if (!(data && data.length)) {
            // this should never happen as it would be caught above
            throw new Error('User record not found.');
        }

        let BasiqUserID = data[0].basiq_user_id;
        if (!BasiqUserID) {
            // step 1: create Basiq user
            BasiqUserID = await createBasiqUser(
                user.email,
                user.user_metadata.mobile,
                user.user_metadata.first_name || '',
                user.user_metadata.last_name || ''
            );
        }
        
        // step 2: get client access token bounded to user
        const clientTokenBountToUser = await getClientTokenBoundToUser(BasiqUserID);
        if (clientTokenBountToUser || clientTokenBountToUser.length) {
            // something went wrong creating the client token
            return Response.json({}, { status: 500 });
        }

        if (!data[0].basiq_user_id) {
            // step 3: store access token in Supabase
            const { error: commitError } = await supabase
            .from('users')
            .update({ 'basiq_user_id': BasiqUserID })
            .eq('id', user.id);

            if (commitError) {
                return Response.json({ error: commitError }, { status: 500 });
            }
        }

        // return url for Consent UI
        const url = `https://consent.basiq.io/home?token=${clientTokenBountToUser}&action=null`;
        return Response.json({ url }, { status: 200 });
    } catch (error) {
        console.log('Error in create new connection route: ', error);
        return Response.json({ error }, { status: 500 });
    }
}