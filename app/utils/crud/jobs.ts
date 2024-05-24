import type { Database, Tables, TablesInsert } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchJobsByUserID(
    userID: string,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userID);

    if (error) {
        console.error(`Error fetching job record: `, error);
        return null;
    };

    return data;
}

export async function insertJobRecord(
    record: TablesInsert<'jobs'>,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('jobs')
    .insert(record);

    if (error) {
        console.error(`Error inserting job record: `, error);
        throw new Error(`Error inserting job record ${error.message}`);
    };
}

export async function deleteJobRecord(
    id: number,
    supabase: SupabaseClient<Database>
) {
    return await supabase
    .from('jobs')
    .delete()
    .eq('id', id);
}