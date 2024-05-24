import type { Database, TablesInsert } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function fetchAllJobRecords(
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('jobs')
    .select('*');

    if (error) {
        console.error(`Error fetching job records: `, error.message);
        return null;
    };

    return data;
}

export async function fetchJobsByUserID(
    userID: string,
    supabase: SupabaseClient<Database>
) {
    const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userID);

    if (error) {
        console.error(`Error fetching job record: `, error.message);
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
        console.error(`Error inserting job record: `, error.message);
        throw new Error(`Error inserting job record ${error.message}`);
    };
}

export async function deleteJobRecord(
    id: number,
    supabase: SupabaseClient<Database>
) {
    const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

    if (error) {
        console.error(`Error deleting job record: `, error.message);
        throw new Error(`Error deleting job record ${error.message}`);
    };
}