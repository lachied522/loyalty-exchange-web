import {
    upsertPointsRecords,
    insertRedeemedRecord,
    fetchUserPointsRecordByStoreID,
} from "@/utils/crud/users";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";
import type { Reward } from "@/types/helpers";

export async function redeemReward(
    reward: Reward,
    userID: string,
    supabase: SupabaseClient<Database>
) {
    // Step 1: check if user has sufficient points
    const pointsRecord = await fetchUserPointsRecordByStoreID(userID, reward.store_id, supabase);
    const balance = pointsRecord?.balance || 0;

    if (balance < reward.cost) {
        return false;
    }

    const promises = [];
    // Step 2: adjust user's points balance at store
    promises.push(
        upsertPointsRecords(
            [{
                balance: balance - reward.cost,
                store_id: reward.store_id,
                user_id: userID,
            }],
            supabase
        )
    );

    // Step 3: insert new reward record
    promises.push(
        insertRedeemedRecord(
            {
                reward_id: reward.id,
                user_id: userID,
                redeemed_at: new Date().toISOString(),
            },
            supabase
        )
    );

    return await Promise.all(promises)
    .then(() => true)
    .catch((e) => {
        console.log('error redeeming reward:', e);
        return false;
    });
}
