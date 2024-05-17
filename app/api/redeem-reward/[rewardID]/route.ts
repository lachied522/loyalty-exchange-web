import { createClient } from '@/utils/supabase/server';
import { redeemReward } from '@/utils/functions/rewards';

import { headers } from 'next/headers';

export async function GET(
    req: Request,
    { params }: { params: { rewardID: string } }
) {
    const headersList = headers();
    const token = headersList.get('token');

    if (!token) {
        return Response.json({} , { status: 401 });
    }

    const supabase = createClient();

    // get user from token
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
        // user not signed in
        return Response.json({} , { status: 401 });
    }

    const rewardID = params.rewardID;
    // fetch reward
    const { data: rewardData } = await supabase
    .from('rewards')
    .select('*')
    .eq('id', rewardID);

    if (!rewardData) {
        return Response.json({}, { status: 404 });
    }

    const isRedeemed = await redeemReward(rewardData[0], user.id, supabase);

    if (!isRedeemed) {
        return Response.json({}, { status: 500 });
    }

    return Response.json({ isRedeemed }, { status: 200 });
}