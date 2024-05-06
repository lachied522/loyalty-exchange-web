import { isRequestAuthenticated } from '@/api/auth';
import { fetchUserData } from '@/lib/crud';
import { createClient } from '@/utils/supabase/server';

import { headers } from 'next/headers';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    const isAuthenticated = await isRequestAuthenticated(params.userID);

    if (!isAuthenticated) {
        return Response.json({} , { status: 401 })
    }

    const supabase = createClient();
    const data = await fetchUserData(params.userID, supabase);

    return Response.json(data);
}