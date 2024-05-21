import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, TablesInsert, TablesUpdate } from "@/types/supabase";

export async function insertRewardRecord(
    record: TablesInsert<'rewards'>,
    supabase: SupabaseClient<Database>,
) {
    const { data, error } = await supabase
    .from('rewards')
    .insert(record)
    .select('*');

    if (error) {
        console.error('Error updating reward record: ', error.message);
        throw new Error(`Error updating reward record ${error}`);
    };

    return data[0];
}

export async function updateRewardRecord(
    record: TablesUpdate<'rewards'>,
    rewardID: string,
    supabase: SupabaseClient<Database>,
) {
    const { error } = await supabase
    .from('rewards')
    .update(record)
    .eq('id', rewardID);

    if (error) {
        console.error('Error updating reward record: ', error.message);
        throw new Error(`Error updating reward record ${error}`);
    };
}

export async function upsertRewardRecord(
    record: TablesInsert<'rewards'>,
    supabase: SupabaseClient<Database>,
) {
    const { data, error } = await supabase
    .from('rewards')
    .upsert(record, { onConflict: 'id' })
    .select();

    if (error) {
        console.error('Error updating reward record: ', error.message);
        throw new Error(`Error updating reward record ${error}`);
    };

    return data[0];
}

export async function deleteReward(
    rewardID: string,
    supabase: SupabaseClient<Database>
) {
    const { error } = await supabase
    .from('rewards')
    .delete()
    .eq('id', rewardID);

    if (error) {
        console.error('Error deleting reward record: ', error.message);
        throw new Error(`Error deleting reward record ${error}`);
    };
}