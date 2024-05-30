import { headers } from 'next/headers';

import { getAuthenticatedUser } from '@/api/auth';
import { createClient } from '@/utils/supabase/server';

import { createBasiqUser, getClientTokenBoundToUser } from '@/utils/basiq/users';


export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    // create a new Basiq access token and bind it to the user
    const headersList = headers();

    const user = await getAuthenticatedUser(params.userID);

    if (!user) {
        return Response.json({} , { status: 401 });
    }

    try {
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
            // user has not been created yet
            if (!(user.email && user.user_metadata.mobile)) {
                return Response.json({ error: 'Could not create access token. User does not have valid email or mobile.' }, { status: 400 })
            }

            // create a new Basiq user
            BasiqUserID = await createBasiqUser(
                user.email,
                user.user_metadata.mobile,
                user.user_metadata.first_name || '',
                user.user_metadata.last_name || ''
            );

            const { error: commitError } = await supabase
            .from('users')
            .update({ 'basiq_user_id': BasiqUserID })
            .eq('id', user.id);

            if (commitError) {
                return Response.json({ error: commitError }, { status: 500 });
            }
        }

        // get access token bound to user
        const clientTokenBountToUser = await getClientTokenBoundToUser(BasiqUserID);
        if (clientTokenBountToUser || clientTokenBountToUser.length) {
            // something went wrong creating the client token
            return Response.json({}, { status: 500 });
        }

        // specify action - https://api.basiq.io/docs/consent-actions
        let action = headersList.get('action') || 'null';
        if (!data[0].basiq_user_id) {
            // user must be initialised regardless of action passed in header
            action = 'null';
        }

        // return url for Consent UI
        const url = `https://consent.basiq.io/home?token=${clientTokenBountToUser}&action=${action}`;
        return Response.json({ url }, { status: 200 });
    } catch (error) {
        console.log('Error in create manage connections route: ', error);
        return Response.json({ error }, { status: 500 });
    }
}