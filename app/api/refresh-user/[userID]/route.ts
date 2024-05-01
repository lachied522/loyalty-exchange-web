import { refreshUserData } from '@/utils/functions/user';
import { createClient } from '@/utils/supabase/server';

import { headers } from 'next/headers';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    // check for new transactions return updated user data
    const headersList = headers();
    const token = headersList.get('token');

    if (!token) {
        return Response.json({} , { status: 401 });
    }

    const supabase = createClient();

    // get user from token
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!(user && params.userID === user.id)) {
        return Response.json({} , { status: 401 });
    }

    const hasNewData = await refreshUserData(user.id, supabase);

    return Response.json({ hasNewData });
}