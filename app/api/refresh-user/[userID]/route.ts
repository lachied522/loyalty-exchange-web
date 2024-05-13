import { isRequestAuthenticated } from '@/api/auth';
import { refreshUserData } from '@/utils/functions/user';
import { createClient } from '@/utils/supabase/server';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    // check for new transactions return updated user data
    const isAuthenticated = isRequestAuthenticated(params.userID);

    if (!isAuthenticated) {
        return Response.json({} , { status: 401 })
    }

    const supabase = createClient();

    try {
        const hasNewData = await refreshUserData(params.userID, supabase);

        return Response.json({ hasNewData });
    } catch (error) {
        console.log('error in refresh user route: ', error);

        return Response.json({ error }, { status: 500 });
    }

}