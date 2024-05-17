import { createClient } from '@/utils/supabase/server';
import { deleteBasiqUser } from '@/utils/basiq/users';
import { isRequestAuthenticated } from '@/api/auth';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    const isAuthenticated = await isRequestAuthenticated(params.userID);

    if (!isAuthenticated) {
        return Response.json({} , { status: 401 })
    }

    const supabase = createClient();

    try {
        // fetch user record
        const { data: userData, error: userError } = await supabase
        .from('users')
        .select('basiq_user_id')
        .eq('id', params.userID);

        // delete user in Basiq API
        if (userData && userData[0].basiq_user_id) {
            deleteBasiqUser(userData[0].basiq_user_id);
        }

        const { data, error } = await supabase.auth.admin.deleteUser(params.userID);

        if (error) {
            throw error;
        }

        return Response.json(data);
    } catch (error) {
        console.log('Error deleting user: ', error);
        return Response.json({ error }, { status: 500 });
    }
}