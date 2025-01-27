"use client";
import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

import ResetPasswordForm from "./reset-password-form";
import SendPasswordResetEmail from "./send-reset-password-email";

export default function ResetPasswordPage() {
    const [supabaseClient, setSupabaseClient] = useState<ReturnType<typeof createClient>>(createClient());
    const [hasSession, setHasSession] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const searchParams = useSearchParams();
    
    useEffect(() => {
        getSessionFromSearchParams();

        async function getSessionFromSearchParams() {
            if (searchParams.get('access_token') && searchParams.get('refresh_token')) {
                const { data, error } = await supabaseClient.auth.setSession({
                    access_token: searchParams.get('access_token')!,
                    refresh_token: searchParams.get('refresh_token')!
                });

                if (error) {
                    console.log(error);
                    return;
                }

                setHasSession(true);
            }

            if (searchParams.get('code')) {
                // supabase client retrieves session automatically
                // see https://supabase.com/docs/guides/auth/passwords?queryGroups=flow&flow=pkce&queryGroups=language&language=js
                setHasSession(true);
            }

            if (searchParams.get('error')) {
                // TO DO: improve error feedback
                setError(true);
            }
        }
    }, [searchParams, supabaseClient, setHasSession, setError]);

    return (
        <>
            {error && (
                <div className='text-center text-red-400'>
                    <p>Sorry, that link has expired or something went wrong.</p>
                    <p>Please try again.</p>
                </div>
            )}

            {hasSession? (
            <ResetPasswordForm supabase={supabaseClient} />
            ) : (
            <SendPasswordResetEmail supabase={supabaseClient} />
            )}
        </>
    )
}