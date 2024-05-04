import { headers } from 'next/headers';

import { createClient } from '@/utils/supabase/server';
import { fetchStoresById } from '@/lib/crud';

export async function GET(
    req: Request,
    { params }: { params: { storeID: string } }
) {
    const headersList = headers();
    const token = headersList.get('token');

    if (!token) {
        return Response.json({} , { status: 401 });
    }

    const supabase = createClient();

    const data = await fetchStoresById([params.storeID], supabase);

    return Response.json(data);
}