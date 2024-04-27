import { createClient } from '@/utils/supabase/server';

import { headers } from 'next/headers';

export async function GET(req: Request) {
    const supabase = createClient();

    const headersList = headers();

    const token = headersList.get('token');

    if (!token) {
        return Response.json({} , { status: 401 });
    }

    const { data } = await supabase.auth.getUser(token);

    console.log('data', data);

    if (!data) {
        return Response.json({} , { status: 401 });
    }


    return Response.json({ data });
}