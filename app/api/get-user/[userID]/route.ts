import { isRequestAuthenticated } from '@/api/auth';
import { fetchAllUserData } from '@/utils/crud/users';
import { createClient } from '@/utils/supabase/server';

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
        const data = await fetchAllUserData(params.userID, supabase);

        return Response.json(data);
    } catch (error) {

        console.log('Error in get user route: ', error);
        return Response.json({ error }, { status: 500 });
    }
    
}