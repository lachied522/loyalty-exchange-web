"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"

import { createClient } from "@/utils/supabase/client";

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

    // get client record
    const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('id, auth_user_id')
    .eq('auth_user_id', user.id);

    if (clientError) {
        throw clientError;
    }

    if (!clientData) {
        throw new Error('Something went wrong. Please try again later.');
    }

    return clientData[0];
}

const formSchema = z.object({
    email: z.string(),
    password: z.string()
});

export default function StoreLoginForm() {
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
            const clientData = await clientLogin(values.email, values.password);

            const redirectUrl = searchParams.get('redirect');
            if (redirectUrl) {
                router.replace(redirectUrl)
            } else {
                router.replace(`/stores/${clientData.id}`);
            }
        } catch (error) {
            console.log({ error });
            form.setError('password', { message: 'Could not login. Please try again later.' });
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
                    className='font-bold'
                >
                    {isLoading? 'Loading...': 'Login'}
                </Button>
            </form>
        </Form>
    )
}