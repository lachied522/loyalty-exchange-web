import { isRequestAuthenticated } from '@/api/auth';
import { refreshUserData } from '@/utils/functions/user';
import { createClient } from '@/utils/supabase/server';

import { headers } from 'next/headers';

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
    const hasNewData = await refreshUserData(params.userID, supabase);

    return Response.json({ hasNewData });
}