import { createClient } from '@/utils/supabase/server';

import { isRequestAuthenticated } from '@/api/auth';

import { deleteBasiqUser } from '@/utils/basiq/users';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    const isAuthenticated = await isRequestAuthenticated(params.userID);

    if (!isAuthenticated) {
        return Response.json({} , { status: 401 })
    }

    try {
        const supabase = createClient();

        // 1. Fetch user record
        const { data: userData, error: userError } = await supabase
        .from('users')
        .select('basiq_user_id')
        .eq('id', params.userID);

        // 2. Delete Basiq user
        let isBasiqUserDeleted = true; // default to true, will be made false if below fails
        if (userData && userData.length && userData[0].basiq_user_id) {
            isBasiqUserDeleted = await deleteBasiqUser(userData[0].basiq_user_id);
        }

        // 3. Delete user from 'public' table
        const { error: publicError } = await supabase
        .from('users')
        .delete()
        .eq('id', params.userID);

        if (publicError) {
            return Response.json({}, { status: 500 });
        }

        // 4. Delete user from 'auth' table
        const { error: authError } = await supabase.auth.admin.deleteUser(params.userID);

        if (authError) {
            return Response.json({}, { status: authError.status });
        }

        return Response.json({} ,{ status: 200 });
    } catch (error: any) {
        console.log('Error deleting user: ', error);
        return Response.json({}, { status: 500 });
    }
}