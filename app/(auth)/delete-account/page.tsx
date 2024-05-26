"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, type User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";

import Logo from "@/logo";

export default function DeleteAccountPage() {
    const [supabaseClient, setSupabaseClient] = useState<SupabaseClient>(createClient());
    const [user, setUser] = useState<User | null>()
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        getUser().then(() => setIsLoading(false));

        async function getUser() {
            if (user) return;
            const { data } = await supabaseClient.auth.getUser();

            if (!data.user) {
                router.replace('/login?redirect=delete-account');
            } else {
                setUser(data.user);
            }
        }
    }, [router, user, supabaseClient]);

    const onDelete = async () => {
        if (!user) return;
        setIsLoading(true);

        await fetch(`/api/delete-user/${user.id}`);
        // sign out user
        await supabaseClient.auth.signOut();
        // navigate to home page
        router.replace('/');
    }

    return (
        <main className='h-[100vh] flex items-center justify-center bg-yellow-100 p-12'>
            <div className='h-full flex flex-col items-center gap-12'>
                <Logo withText />
                <div className='w-[360px] flex flex-col items-stretch gap-6'>
                    <h3 className='text-center text-xl font-semibold'>Delete My Account</h3>
                    <p>Delete my account and all of my data, including transactions information. This cannot be undone.</p>
                    <Button
                        onClick={onDelete}
                        disabled={isLoading}
                        className='font-bold'
                    >
                        Delete Account
                    </Button>
                </div>
            </div>
        </main>
    )
}