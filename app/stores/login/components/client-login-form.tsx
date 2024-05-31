"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

import { createClient } from "@/utils/supabase/client";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";

async function convertUserToClient(
    user: User,
    supabase: SupabaseClient<Database>
) {
    // if an existing user tries to signup as a client it will result in an error
    // must manually update user metadata and insert client record
    try {
        await supabase
        .from('clients')
        .upsert({
            id: user.id,
            email: user.email,
            name: user.user_metadata['first_name'] || 'Client'
        }, {
            onConflict: 'id',
            ignoreDuplicates: false
        })
        .throwOnError();
    } catch (error) {
        console.error({error});
    }

    await supabase.auth.updateUser({
        data: { role: 'client' }
    });
}

async function clientLogin(
    email: string,
    password: string
) {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    
    if (authError) {
        throw authError;
    }

    if (!user) {
        throw new Error('Username or password incorrect');
    }

    if (user.user_metadata['role'] !== 'client') {
        // user is not set up as a client
        await convertUserToClient(user, supabase);
    }

    return user.id;
}

const formSchema = z.object({
    email: z.string(),
    password: z.string()
});

export default function ClientLoginForm() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        
        try {
            const clientID = await clientLogin(
                values.email,
                values.password
            );

            const redirectUrl = searchParams.get('redirect');
            if (redirectUrl) {
                router.replace(redirectUrl);
            } else {
                router.replace(`/stores/${clientID}`);
            }
        } catch (error: any) {
            form.setError('password', { message: error.message || 'Could not login. Please try again later.' });
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='md:w-[360px] w-[240px] flex flex-col items-stretch gap-2'>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className='font-bold mt-2'
                >
                    {isLoading? 'Loading...': 'Login'}
                </Button>

                <div className='flex flex-row justify-between text-base mt-2'>
                    Don&apos;t have an account?
                    <Link href='/stores/signup' className='text-blue-400 underline'>Signup</Link>
                </div>
            </form>
        </Form>
    )
}