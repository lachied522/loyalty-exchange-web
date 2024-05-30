import { createClient } from '@/utils/supabase/server';

import { getAuthenticatedUser } from '@/api/auth';

import { insertJobRecord } from '@/utils/crud/jobs';

export async function GET(
    req: Request,
    { params }: { params: { userID: string } }
) {
    const user = await getAuthenticatedUser(params.userID);

    if (!user) {
        return Response.json({} , { status: 401 })
    }

    try {
        const supabase = createClient();

        // user deletion is delayed for 24 hours so that any final transactions made will be recorded
        // create a 'job' record to delete user
        await insertJobRecord(
            {
                job_type: 'delete-user',
                user_id: params.userID,
            },
            supabase
        );

        // User cannot be deleted from auth table without a database violation
        // We will instead ban the user account to prevent login before deletion
        const { error: authError } = await supabase.auth.admin.updateUserById(params.userID, {
            ban_duration: "876600h"
        });

        if (authError) {
            console.error({ authError });
            return Response.json({}, { status: authError.status });
        }

        return Response.json({} ,{ status: 200 });
    } catch (error: any) {
        console.error('Error deleting user: ', error);
        return Response.json({}, { status: 500 });
    }
}