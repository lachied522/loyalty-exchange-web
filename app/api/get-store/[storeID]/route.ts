import { headers } from 'next/headers';

import { createClient } from '@/utils/supabase/server';
import { fetchStoresById } from '@/utils/crud/stores';

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

    if (!data) {
        return Response.json({}, { status: 404 });
    }

    return Response.json(data, { status: 200 });
}