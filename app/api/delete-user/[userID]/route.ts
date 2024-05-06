import { createClient } from '@/utils/supabase/server';

import { getBasiqServerAccessToken } from '@/lib/basiq';

import { isRequestAuthenticated } from '@/api/auth';

async function deleteBasiqUser(BasiqUserId: string) {
    if (!BasiqUserId) return;

    const serverAccessToken = await getBasiqServerAccessToken();

    return fetch(`https://au-api.basiq.io/users/${BasiqUserId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${serverAccessToken}`,
            'Accept': 'application/json',
        },
        body: JSON.stringify({ scope: 'SERVER_ACCESS' }),
    });
}

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    const isAuthenticated = await isRequestAuthenticated(params.userID);

    if (!isAuthenticated) {
        return Response.json({} , { status: 401 })
    }

    // delete user in Basiq API
    const supabase = createClient();
    const { data: userData, error: userError } = await supabase
    .from('users')
    .select('basiq_user_id')
    .eq('id', params.userID);

    if (userData && userData[0].basiq_user_id) {
        deleteBasiqUser(userData[0].basiq_user_id);
    }

    const { data, error } = await supabase.auth.admin.deleteUser(params.userID);

    if (error) {
        throw error;
    }

    return Response.json(data);
}